import { useState } from "react";
import { Network, API_URLS } from "./useAtomData";

// Interface for triple details returned from GraphQL
export interface TripleDetails {
  id: string;
  subject?: {
    label: string;
  };
  predicate?: {
    label: string;
  };
  object?: {
    label: string;
  };
  vault_id?: string;
  vault_position_count?: number;
  counter_vault_id?: string;
  counter_vault_position_count?: number;
}

interface UseFetchTripleDetailsProps {
  network?: Network;
  onError?: (message: string) => void;
}

export const useFetchTripleDetails = ({
  network = Network.MAINNET,
  onError
}: UseFetchTripleDetailsProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch triple details via GraphQL
  const fetchTripleDetails = async (tripleId: bigint): Promise<TripleDetails | null> => {
    setIsLoading(true);

    try {
      const apiUrl = API_URLS[network];

      console.log(`Fetching triple ${tripleId} from ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query Triple($tripleId: numeric!) {
              triple(id: $tripleId) {
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
                vault {
                  position_count
                }
                counter_vault_id
                counter_vault {
                  position_count
                }
              }
            }
          `,
          variables: { tripleId: Number(tripleId) },
        }),
      });

      if (!response.ok) {
        console.error(`GraphQL request failed with status ${response.status}: ${response.statusText}`);
        if (onError) {
          onError(`GraphQL request failed with status ${response.status}: ${response.statusText}`);
        }
        setIsLoading(false);
        return null;
      }

      const result = await response.json();
      console.log("API Response:", JSON.stringify(result, null, 2));

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        if (onError) {
          onError(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
        setIsLoading(false);
        return null;
      }

      if (!result.data?.triple) {
        console.warn(`Triple with ID ${tripleId} not found`);
        if (onError) {
          onError(`Triple with ID ${tripleId} not found`);
        }
        setIsLoading(false);
        return null;
      }

      // Extract position counts from the nested structure if available
      const vaultPositionCount = result.data.triple.vault?.position_count || 0;
      const counterVaultPositionCount = result.data.triple.counter_vault?.position_count || 0;

      setIsLoading(false);
      return {
        id: String(tripleId),
        ...result.data.triple,
        vault_position_count: vaultPositionCount,
        counter_vault_position_count: counterVaultPositionCount
      };
    } catch (error) {
      console.error(`Error fetching details for triple ${tripleId}:`, error);
      if (onError) {
        onError(`Error fetching details for triple ${tripleId}: ${error instanceof Error ? error.message : String(error)}`);
      }
      setIsLoading(false);
      return null;
    }
  };

  return {
    fetchTripleDetails,
    isLoading
  };
}; 