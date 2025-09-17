import { Network, API_URLS } from "../hooks/useAtomData";

/**
 * Function to directly check a user's position on a specific triple
 * This can be helpful for debugging position-related issues
 */
export const checkTriplePosition = async (
  walletAddress: string,
  tripleId: string | number,
  network: Network = Network.MAINNET
): Promise<{
  hasPosition: boolean;
  isFor: boolean | null;
  result: any;
}> => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    const apiUrl = API_URLS[network];

    // Direct query to check position
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetTripleUserPosition($tripleId: numeric!, $walletAddress: String!) {
            # Get the triple with vault information
            triple(term_id: $tripleId) {
              id
              subject {
                label
              }
              predicate {
                label
              }
              object {
                label
              }
              term_id
              counter_term_id
              
              # Get vault positions
              term {
                id
                positions_aggregate(where: {account: {id: {_ilike: $walletAddress}}}) {
                  aggregate {
                    count
                  }
                  nodes {
                    id
                  }
                }
              }
              
              # Get counter vault positions
              counter_term {
                id
                positions_aggregate(where: {account: {id: {_ilike: $walletAddress}}}) {
                  aggregate {
                    count
                  }
                  nodes {
                    id
                  }
                }
              }
            }
          }
        `,
        variables: {
          tripleId: Number(tripleId),
          walletAddress: walletAddress.toLowerCase()
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    // Check if user has a position in any of the queried places
    const tripleInfo = result.data?.triple;
    if (!tripleInfo) {
      return {
        hasPosition: false,
        isFor: null,
        result: result.data
      };
    }

    const hasTermPosition =
      tripleInfo.term?.positions_aggregate?.aggregate?.count > 0 ||
      tripleInfo.term?.positions_aggregate?.nodes?.length > 0;

    const hasCounterTermPosition =
      tripleInfo.counter_term?.positions_aggregate?.aggregate?.count > 0 ||
      tripleInfo.counter_term?.positions_aggregate?.nodes?.length > 0;

    // Set states based on position findings
    const foundPosition = hasTermPosition || hasCounterTermPosition;
    const isFor = foundPosition ? hasTermPosition : null;

    return {
      hasPosition: foundPosition,
      isFor,
      result: result.data // Return raw data for debugging
    };
  } catch (err) {
    console.error("Error checking triple position:", err);
    throw err;
  }
}; 