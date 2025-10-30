import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Active Positions by Account (only positions with shares > 0)
// Récupère toutes les positions par batch de 100 pour éviter la limite
export const fetchPositions = async (
  accountId: string,
  network: Network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];
    const allPositions: any[] = [];
    const batchSize = 100;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query GetActivePositions($accountId: String!, $limit: Int!, $offset: Int!) {
  positions(where: { account_id: { _eq: $accountId }, shares: { _gt: 0 } }, limit: $limit, offset: $offset) {
    id
    shares
    curve_id
    account {
      id
      label
      image
      atom_id
      type
    }
    term {
      id
      total_market_cap
      total_assets
      atom {
        label
      }
      triple {
        subject {
          label
        }
        predicate {
          label
        }
        object {
          label
        }
        counter_term {
          id
          total_market_cap
          total_assets
          atom {
            label
          }
          triple {
            subject {
              label
            }
            predicate {
              label
            }
            object {
              label
            }
          }
        }
      }
    }
    vault {
      deposits {
        vault_type
      }
      redemptions {
        vault_type
      }
    }
  }
}`,
          variables: { accountId, limit: batchSize, offset }
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }

      const positions = data.data?.positions || [];
      
      if (positions.length === 0) {
        hasMore = false;
      } else {
        allPositions.push(...positions);
        
        // Si on a reçu moins de batchSize résultats, c'est la dernière page
        if (positions.length < batchSize) {
          hasMore = false;
        } else {
          offset += batchSize;
        }
      }
      
      // Sécurité : éviter les boucles infinies (max 1000 pages = 100k positions)
      if (offset > 100000) {
        hasMore = false;
      }
    }

    return allPositions;
  } catch (error) {
    console.error('Error fetching active positions:', error);
    return [];
  }
};
