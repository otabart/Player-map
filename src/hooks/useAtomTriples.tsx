import { useState, useEffect } from "react";
import { Network, API_URLS } from "./useAtomData";

const GET_ATOM_TRIPLES = `
  query Atom($atomId: numeric!) {
    atom(id: $atomId) {
      as_subject_triples {
        subject_id
        predicate_id
        object_id
      }
    }
  }
`;

export interface Triple {
  subject_id: string;
  predicate_id: string;
  object_id: string;
}

export interface AtomTriplesResponse {
  atom: {
    as_subject_triples: Triple[];
  } | null;
}

// Fonction qui récupère les triples où un atom est sujet en utilisant fetch directement
export const fetchAtomTriples = async (
  atomId: number,
  network: Network = Network.MAINNET
): Promise<AtomTriplesResponse> => {
  const url = API_URLS[network];
  const variables = { atomId };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ATOM_TRIPLES,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || "Erreur GraphQL inconnue");
    }

    return result.data as AtomTriplesResponse;
  } catch (error) {
    console.error(
      `[fetchAtomTriples] Erreur lors de la requête directe vers ${url}:`,
      error
    );
    throw error;
  }
};

// Hook pour récupérer et vérifier les triples d'un atom
export const useAtomTriples = (
  atomId: string | null,
  network: Network = Network.MAINNET
) => {
  const numericAtomId = atomId ? parseInt(atomId) : null;
  const [data, setData] = useState<AtomTriplesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!numericAtomId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchAtomTriples(numericAtomId, network);
        setData(response);
      } catch (err) {
        console.error(
          `[${network}] Erreur lors de la récupération des triples de l'atom (ID=${numericAtomId}):`,
          err
        );
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericAtomId, network]);

  const triples = data?.atom?.as_subject_triples || [];

  // Helper function to check if a specific triple exists
  const hasTriple = (predicateId: string, objectId: string): boolean => {
    return triples.some(
      (triple: Triple) =>
        triple.predicate_id === predicateId && triple.object_id === objectId
    );
  };

  return {
    loading,
    error,
    triples,
    hasTriple,
    network,
    rawData: data, // Ajouter les données brutes pour le débogage
  };
};

export default useAtomTriples;
