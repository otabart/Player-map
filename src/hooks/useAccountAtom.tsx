import { useState, useEffect } from "react";
import { Network, API_URLS } from "./useAtomData";

const GET_ACCOUNT_ATOM = `
  query Atom($accountId: String!) {
    account(id: $accountId) {
      atom {
        id
      }
    }
  }
`;

export interface AccountAtomResponse {
  account: {
    atom: {
      id: string;
    } | null;
  } | null;
}

// Fonction qui récupère un atom de type account par son accountId en utilisant fetch directement
export const fetchAccountAtom = async (
  accountId: string,
  network: Network = Network.MAINNET
): Promise<AccountAtomResponse> => {
  const url = API_URLS[network];
  const variables = { accountId };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ACCOUNT_ATOM,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || "Erreur GraphQL inconnue");
    }

    return result.data as AccountAtomResponse;
  } catch (error) {
    console.error(
      `[fetchAccountAtom] Erreur lors de la requête directe vers ${url}:`,
      error
    );
    throw error;
  }
};

// Hook pour récupérer et vérifier si un utilisateur a un atom de type account
export const useAccountAtom = (
  accountId: string,
  network: Network = Network.MAINNET
) => {
  const [data, setData] = useState<AccountAtomResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchAccountAtom(accountId, network);
        setData(response);
      } catch (err) {
        console.error(
          `[${network}] Erreur lors de la vérification de l'atom account (ID=${accountId}):`,
          err
        );
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, network]);

  const hasAccountAtom = !!data?.account?.atom;
  const accountAtomId = data?.account?.atom?.id || null;

  return {
    loading,
    error,
    hasAccountAtom,
    accountAtomId,
    network,
    rawData: data, // Ajouter les données brutes pour le débogage
  };
};

export default useAccountAtom;
