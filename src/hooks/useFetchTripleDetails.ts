import { useState } from "react";
import { Network, API_URLS } from "./useAtomData";
import { GetTripleDocument, fetcher } from '@0xintuition/graphql';

// Interface for triple details returned from GraphQL v2
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

  // Function to fetch triple details via GraphQL v2
  const fetchTripleDetails = async (tripleId: string): Promise<TripleDetails | null> => {
    setIsLoading(true);

    try {
      // Utiliser le package @0xintuition/graphql pour v2
      const apiUrl = API_URLS[network];
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
          query Triple($tripleId: String!) {
            triple(term_id: $tripleId) {
              term_id
              subject_id
              predicate_id
              object_id
              subject {
                term_id
                label
              }
              predicate {
                term_id
                label
              }
              object {
                term_id
                label
              }
              term_id
              term {
                total_market_cap
                total_assets
              }
              counter_term_id
              counter_term {
                total_market_cap
                total_assets
              }
            }
          }
        `,

          variables: { tripleId: tripleId.toString() }, // Convertir en string pour v2
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

      // Extract position counts from the nested structure v2
      const termPositionCount = result.data.triple.term?.positions_aggregate?.aggregate?.count || 0;
      const counterTermPositionCount = result.data.triple.counter_term?.positions_aggregate?.aggregate?.count || 0;

      setIsLoading(false);
      return {
        id: String(tripleId),
        subject: result.data.triple.subject,
        predicate: result.data.triple.predicate,
        object: result.data.triple.object,
        term_id: result.data.triple.term_id,
        counter_term_id: result.data.triple.counter_term_id,
        term_position_count: termPositionCount,
        counter_term_position_count: counterTermPositionCount
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