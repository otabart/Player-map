import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Active Positions by Account (only positions with shares > 0)
export const fetchPositions = async (
  accountId: string,
  network: Network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetActivePositions($accountId: String!) {
            positions(where: { 
              account_id: { _eq: $accountId },
              shares: { _gt: 0 }
            }) {
              id
              shares
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
          }
        `,
        variables: { accountId }
      })
    });
    const data = await response.json();
    return data.data?.positions || [];
  } catch (error) {
    console.error('Error fetching active positions:', error);
    return [];
  }
};
