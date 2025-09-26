import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Claims by Subject (atom as subject)
export const fetchClaimsBySubject = async (
  subjectId: string,
  network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        query ClaimsBySubject($subjectId: String!) {
          triples(where: { subject_id: { _eq: $subjectId } }) {
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
              positions_aggregate(where: { shares: { _gt: 0 } }) {
                aggregate { count }
              }
            }
            counter_term {
              id
              total_market_cap
              positions_aggregate(where: { shares: { _gt: 0 } }) {
                aggregate { count }
              }
            }
          }
        }
      `,
        variables: { subjectId }
      })
    });

    const data = await response.json();
    return data.data?.triples || [];
  } catch (error) {
    console.error('Error fetching claims by subject:', error);
    return [];
  }
};
