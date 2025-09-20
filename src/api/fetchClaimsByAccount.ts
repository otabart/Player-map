import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Claims by Account
export const fetchClaimsByAccount = async (
  accountId: string,
  network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        query ClaimsByAccount($accountId: String!) {
          triples(where: { creator_id: { _eq: $accountId } }) {
            term_id
            subject {
              term_id
              label
              type
              image
            }
            predicate {
              term_id
              label
              type
            }
            object {
              term_id
              label
              type
              image
            }
            term {
              total_market_cap
              positions_aggregate {
                aggregate { count }
              }
            }
            counter_term {
              total_market_cap
              positions_aggregate {
                aggregate { count }
              }
            }
          }
        }
      `,
        variables: { accountId }
      })
    });

    const data = await response.json();
    return data.data?.triples || [];
  } catch (error) {
    console.error('Error fetching claims by account:', error);
    return [];
  }
};




