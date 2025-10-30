import { Network, API_URLS } from '../hooks/useAtomData';

// Helper function to fetch all data from a query with pagination
const fetchAllWithPagination = async (
  apiUrl: string,
  query: string,
  variables: any,
  dataPath: string,
  batchSize: number = 100
): Promise<any[]> => {
  const allResults: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { ...variables, limit: batchSize, offset }
      })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const results = data.data?.[dataPath] || [];
    
    if (results.length === 0) {
      hasMore = false;
    } else {
      allResults.push(...results);
      
      // Si on a reçu moins de batchSize résultats, c'est la dernière page
      if (results.length < batchSize) {
        hasMore = false;
      } else {
        offset += batchSize;
      }
    }
  }

  return allResults;
};

// Fetch Activity History by Account (all deposits and redemptions)
// Récupère toutes les activités par batch de 100 pour éviter la limite
export const fetchActivityHistory = async (
  accountId: string,
  network: Network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];
    const batchSize = 100;

    // Query pour deposits
    const depositsQuery = `
      query GetDeposits($accountId: String!, $limit: Int!, $offset: Int!) {
        deposits(
          limit: $limit,
          offset: $offset,
          where: { sender_id: { _eq: $accountId } }
        ) {
          id
          shares
          assets_after_fees
          created_at
          vault_type
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
        }
      }
    `;

    // Query pour redemptions
    const redemptionsQuery = `
      query GetRedemptions($accountId: String!, $limit: Int!, $offset: Int!) {
        redemptions(
          limit: $limit,
          offset: $offset,
          where: { sender_id: { _eq: $accountId } }
        ) {
          id
          shares
          assets
          created_at
          vault_type
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
        }
      }
    `;

    // Récupérer deposits et redemptions en parallèle
    const [deposits, redemptions] = await Promise.all([
      fetchAllWithPagination(apiUrl, depositsQuery, { accountId }, 'deposits', batchSize),
      fetchAllWithPagination(apiUrl, redemptionsQuery, { accountId }, 'redemptions', batchSize)
    ]);

    // Add type field to distinguish between deposits and redemptions
    const activities = [
      ...deposits.map((deposit: any) => ({ ...deposit, activity_type: 'deposit' })),
      ...redemptions.map((redemption: any) => ({ ...redemption, activity_type: 'redemption' }))
    ];

    // Sort by created_at (most recent first)
    return activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return [];
  }
};
