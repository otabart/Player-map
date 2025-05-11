import { useState, useEffect } from "react";
import { Network, API_URLS } from "./useAtomData";

const GET_TRIPLES_BY_CREATOR = `
  query GetTriplesByCreator($creatorId: String!, $predicateId: numeric!, $objectId: numeric!) {
    triples(where: {
      subject: { creator_id: { _eq: $creatorId } },
      predicate_id: { _eq: $predicateId },
      object_id: { _eq: $objectId }
    }) {
      id
      subject_id
      predicate_id
      object_id
      subject {
        id
        label
        type
        creator_id
      }
      predicate {
        id
        label
        type
      }
      object {
        id
        label
        type
      }
      block_number
      block_timestamp
      transaction_hash
    }
  }
`;

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
  predicateId: number = 24442,
  objectId: number = 24441,
  network: Network = Network.MAINNET
): Promise<TriplesByCreatorResponse> => {
  const url = API_URLS[network];
  const variables = { creatorId, predicateId, objectId };

  console.log(
    `[fetchTriplesByCreator] Requête directe vers ${url} avec variables:`,
    variables
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: GET_TRIPLES_BY_CREATOR,
        variables,
      }),
    });

    const result = await response.json();
    console.log(`[fetchTriplesByCreator] Réponse brute:`, result);

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
  predicateId: number = 24442,
  objectId: number = 24441,
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

      console.log(
        `[useTripleByCreator] Démarrage de la requête pour creatorId=${creatorId}, predicateId=${predicateId}, objectId=${objectId} sur le réseau ${network}`
      );

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
