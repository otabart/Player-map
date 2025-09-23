import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Triples filtered for Agent view
export const fetchTriplesForAgent = async (
  objectId: string,
  network: Network = Network.MAINNET,
  batchSize = 1000
) => {
  try {
    const apiUrl = API_URLS[network];
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query Triples_for_Agent($objectId: String!, $batchSize: Int!) {
            triples(limit: $batchSize, where: { object_id: { _eq: $objectId } }) {
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
                image
              }
              object {
                term_id
                label
                type
                image
              }
              term {
                total_market_cap
                total_assets
                positions_aggregate {
                  aggregate {
                    count
                  }
                }
              }
              counter_term {
                total_market_cap
                total_assets
                positions_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            }
          }
        `,
        variables: { objectId, batchSize }
      })
    });

    const data = await response.json();
    return data.data?.triples || [];
  } catch (error) {
    console.error('Error fetching triples for agent:', error);
    return [];
  }
};




