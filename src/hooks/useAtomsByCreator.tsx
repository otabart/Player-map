import { useState, useEffect } from "react";
import { Network, API_URLS, AtomData } from "./useAtomData";

const GET_ATOMS_BY_CREATOR = `
  query GetAtomsByCreator($creatorId: String!) {
    atoms(where: { creator_id: { _eq: $creatorId } }) {
      id
      label
      type
      data
      emoji
      image
      creator_id
      creator {
        id
        label
      }
      block_number
      block_timestamp
      transaction_hash
    }
  }
`;

export interface AtomsByCreatorResponse {
  atoms: AtomData[];
}

// Fonction qui récupère les atomes créés par une adresse spécifique
export const fetchAtomsByCreator = async (
  creatorId: string,
  network: Network = Network.MAINNET
): Promise<AtomsByCreatorResponse> => {
  const url = API_URLS[network];
  const variables = { creatorId };

  console.log(
    `[fetchAtomsByCreator] Requête directe vers ${url} avec variables:`,
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
        query: GET_ATOMS_BY_CREATOR,
        variables,
      }),
    });

    const result = await response.json();
    console.log(`[fetchAtomsByCreator] Réponse brute:`, result);

    if (result.errors) {
      throw new Error(result.errors[0]?.message || "Erreur GraphQL inconnue");
    }

    return result.data as AtomsByCreatorResponse;
  } catch (error) {
    console.error(
      `[fetchAtomsByCreator] Erreur lors de la requête directe vers ${url}:`,
      error
    );
    throw error;
  }
};

// Hook pour récupérer et afficher les atomes créés par un utilisateur
export const useAtomsByCreator = (
  creatorId: string,
  network: Network = Network.MAINNET
) => {
  const [data, setData] = useState<AtomsByCreatorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!creatorId) {
        setLoading(false);
        return;
      }

      console.log(
        `[useAtomsByCreator] Démarrage de la requête pour creatorId=${creatorId} sur le réseau ${network}`
      );

      try {
        const response = await fetchAtomsByCreator(creatorId, network);
        setData(response);
      } catch (err) {
        console.error(
          `[${network}] Erreur lors de la récupération des atomes créés par (ID=${creatorId}):`,
          err
        );
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [creatorId, network]);

  const atoms = data?.atoms || [];

  return {
    loading,
    error,
    atoms,
    network,
    rawData: data,
  };
};

export default useAtomsByCreator;
