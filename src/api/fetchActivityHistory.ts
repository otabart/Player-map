import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Activity History by Account (all deposits and redemptions)
export const fetchActivityHistory = async (
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
          query GetActivityHistory($accountId: String!) {
            deposits(where: { sender_id: { _eq: $accountId } }) {
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
            redemptions(where: { sender_id: { _eq: $accountId } }) {
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
        `,
        variables: { accountId }
      })
    });
    const data = await response.json();

    // Combine deposits and redemptions into a single activity history
    const deposits = data.data?.deposits || [];
    const redemptions = data.data?.redemptions || [];

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
