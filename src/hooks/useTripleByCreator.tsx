import { useState, useEffect } from "react";
import { Network, API_URLS } from "./useAtomData";
import { PLAYER_TRIPLE_TYPES } from "../utils/constants";
import { GetTriplesDocument, fetcher } from '@0xintuition/graphql';

export interface Triple {
  id: string;
  subject_id: string;
  predicate_id: string;
  object_id: string;
  subject: {
    id: string;
    label: string;
    type: string;
    creator_id: string;
  };
  predicate: {
    id: string;
    label: string;
    type: string;
  };
  object: {
    id: string;
    label: string;
    type: string;
  };
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
}

export interface TriplesByCreatorResponse {
  triples: Triple[];
}

// Fonction qui récupère les triples où le sujet a été créé par une adresse spécifique
// et avec un prédicat et un objet spécifiques
export const fetchTriplesByCreator = async (
  creatorId: string,
  predicateId: number = Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.predicateId),
  objectId: number = Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.objectId),
  network: Network = Network.MAINNET
): Promise<TriplesByCreatorResponse> => {
  const url = API_URLS[network];
  
  // Construire la condition where pour filtrer par creator_id, predicate_id et object_id
  const variables = { 
    where: {
      subject: { creator_id: { _eq: creatorId } },
      predicate_id: { _eq: predicateId },
      object_id: { _eq: objectId }
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: GetTriplesDocument,
        variables,
      }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0]?.message || "Erreur GraphQL inconnue");
    }

    return result.data as TriplesByCreatorResponse;
  } catch (error) {
    console.error(
      `[fetchTriplesByCreator] Erreur lors de la requête directe vers ${url}:`,
      error
    );
    throw error;
  }
};

// Hook pour récupérer les triples avec des conditions spécifiques
export const useTripleByCreator = (
  creatorId: string,
  predicateId: number = Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.predicateId),
  objectId: number = Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.objectId),
  network: Network = Network.MAINNET
) => {
  const [data, setData] = useState<TriplesByCreatorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!creatorId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchTriplesByCreator(
          creatorId,
          predicateId,
          objectId,
          network
        );
        setData(response);
      } catch (err) {
        console.error(
          `[${network}] Erreur lors de la récupération des triples:`,
          err
        );
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [creatorId, predicateId, objectId, network]);

  const triples = data?.triples || [];

  return {
    loading,
    error,
    triples,
    network,
    rawData: data,
  };
};

export default useTripleByCreator;
