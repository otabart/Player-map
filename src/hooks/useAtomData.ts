import { useState, useEffect } from 'react';
import { createServerClient } from '@0xintuition/graphql';

// Types communs pour les atomes
export interface AtomData {
  id: number;
  label: string;
  type: string;
  data: string | null;
  emoji: string | null;
  image: string | null;
  creator_id: string;
  creator: {
    id: string;
    label: string;
  };
  value: {
    id: number;
  } | null;
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
}

// Type pour la réponse de la requête
export interface AtomResponse {
  atom: AtomData;
}

// Enum pour les différents réseaux disponibles
export enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet'
}

// URLs des API GraphQL
export const API_URLS = {
  [Network.MAINNET]: 'https://prod.base.intuition-api.com/v1/graphql',
  [Network.TESTNET]: 'https://dev.base-sepolia.intuition-api.com/v1/graphql' // TODO: change to mainnet
};

// Fonction pour créer un client avec le réseau approprié
export const createClient = (network: Network = Network.MAINNET): ReturnType<typeof createServerClient> => {
  const options = {
    url: API_URLS[network],
    headers: {
      'Content-Type': 'application/json',
      // Add an API key header if available
      // 'x-api-key': process.env.INTUITION_API_KEY || ''
    },
    token: undefined // Assuming token is optional and can be undefined
  };
  return createServerClient(options);
};

// Fonction qui récupère un atome par son ID
export const fetchAtomById = async (id: number, network: Network = Network.MAINNET): Promise<AtomResponse> => {
  const client = createClient(network);

  const query = `
    query GetAtomById($id: numeric!) {
      atom(id: $id) {
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
        value {
          id
        }
        block_number
        block_timestamp
        transaction_hash
      }
    }
  `;

  const variables = { id };
  return await client.request<AtomResponse>(query, variables);
};

// Fonction qui récupère un atome par son label
export const fetchAtomByLabel = async (label: string, network: Network = Network.MAINNET): Promise<{ atoms: AtomData[] }> => {
  const client = createClient(network);

  const query = `
    query GetAtomByLabel($label: String!) {
      atoms(where: { label: { _eq: $label } }, limit: 1) {
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
        value {
          id
        }
        block_number
        block_timestamp
        transaction_hash
      }
    }
  `;

  const variables = { label };
  return await client.request<{ atoms: AtomData[] }>(query, variables);
};

// Types pour les hooks réexportés
export interface AtomByIdHook {
  data: AtomResponse | null;
  loading: boolean;
  error: string | null;
  network: Network;
}

export interface AtomByLabelHook {
  data: AtomData | null;
  loading: boolean;
  error: string | null;
  network: Network;
}

// Note: Ces importations génèrent des erreurs de TypeScript mais fonctionnent à l'exécution
// car les fichiers existent bien. Ce problème sera résolu après la compilation.
// Re-exporter les hooks spécifiques
export { useMainnetAtomById, useMainnetAtomByLabel } from './useMainnetAtomData';
export { useTestnetAtomById, useTestnetAtomByLabel } from './useTestnetAtomData';

// Hook générique pour récupérer un atome par ID (rétrocompatibilité)
export const useAtomById = (id: number, network: Network = Network.MAINNET) => {
  const [data, setData] = useState<AtomResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAtomById(id, network);
        setData(response);
        setLoading(false);
      } catch (err) {
        console.error(`[${network}] Erreur lors de la récupération de l'atome ID=${id}:`, err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, network]);

  return { data, loading, error };
};

// Hook générique pour récupérer un atome par label (rétrocompatibilité)
export const useAtomByLabel = (label: string, network: Network = Network.MAINNET) => {
  const [data, setData] = useState<AtomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAtomByLabel(label, network);
        if (response.atoms && response.atoms.length > 0) {
          setData(response.atoms[0]);
        } else {
          setError(`Aucun atome trouvé avec ce label sur ${network}`);
        }
        setLoading(false);
      } catch (err) {
        console.error(`[${network}] Erreur lors de la récupération de l'atome label="${label}":`, err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [label, network]);

  return { data, loading, error };
}; 