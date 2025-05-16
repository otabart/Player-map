import { useState, useEffect } from 'react';
import { Network, API_URLS } from "./useAtomData";

interface UseCheckSpecificTriplePositionProps {
  walletAddress: string;
  tripleId: string | number;
  network?: Network;
}

export const useCheckSpecificTriplePosition = ({
  walletAddress,
  tripleId,
  network = Network.TESTNET
}: UseCheckSpecificTriplePositionProps) => {
  const [hasPosition, setHasPosition] = useState<boolean>(false);
  const [isFor, setIsFor] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !tripleId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiUrl = API_URLS[network];

        // Directly query the current user's position on the specific triple
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query GetTripleUserPosition($tripleId: numeric!, $walletAddress: String!) {
                # Get the triple with vault information
                triple(id: $tripleId) {
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
                  vault_id
                  counter_vault_id
                  
                  # Get vault positions
                  vault {
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
                  counter_vault {
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
        console.log('DIRECT TRIPLE POSITION QUERY RESULT:', JSON.stringify(result, null, 2));

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }

        // Check if user has a position in any of the queried places
        const tripleInfo = result.data?.triple;
        if (!tripleInfo) {
          setHasPosition(false);
          setIsFor(null);
          setLoading(false);
          return;
        }

        const hasVaultPosition =
          tripleInfo.vault?.positions_aggregate?.aggregate?.count > 0 ||
          tripleInfo.vault?.positions_aggregate?.nodes?.length > 0;

        const hasCounterVaultPosition =
          tripleInfo.counter_vault?.positions_aggregate?.aggregate?.count > 0 ||
          tripleInfo.counter_vault?.positions_aggregate?.nodes?.length > 0;

        // Set states based on position findings
        const foundPosition = hasVaultPosition || hasCounterVaultPosition;
        setHasPosition(foundPosition);

        if (foundPosition) {
          setIsFor(hasVaultPosition);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error checking triple position:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, tripleId, network]);

  return { hasPosition, isFor, loading, error };
}; 