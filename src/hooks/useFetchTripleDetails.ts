import { useState } from "react";
import { Network, API_URLS } from "./useAtomData";
import { GetTripleDocument, fetcher } from '@0xintuition/graphql';

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
  term_id?: string;
  term_position_count?: number;
  counter_term_id?: string;
  counter_term_position_count?: number;
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
      // Utilisons directement la méthode fetch qui est plus fiable
      const apiUrl = API_URLS[network];
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query Triple($tripleId: numeric!) {
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
                term {
                  position_count
                }
                counter_term_id
                counter_term {
                  position_count
                }
              }
            }
          `,
          variables: { tripleId: Number(tripleId) },
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      if (!result.data?.triple) {
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
        subject: result.data.triple.subject,
        predicate: result.data.triple.predicate,
        object: result.data.triple.object,
        term_id: result.data.triple.term_id,
        counter_term_id: result.data.triple.counter_term_id,
        term_position_count: vaultPositionCount,
        counter_term_position_count: counterVaultPositionCount
      };
    } catch (error) {
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