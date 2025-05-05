import { useState, useEffect } from 'react';
import { createServerClient } from '@0xintuition/graphql';

// Type pour les résultats de l'atome
interface AtomData {
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
interface AtomResponse {
  atom: AtomData;
}

// Fonction qui récupère un atome par son ID
export const fetchAtomById = async (id: number): Promise<AtomResponse> => {
  const client = createServerClient({
    // Ajoutez votre token d'authentification si nécessaire
    // token: 'your-auth-token'
  });

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
export const fetchAtomByLabel = async (label: string): Promise<{ atoms: AtomData[] }> => {
  const client = createServerClient({
    // Ajoutez votre token d'authentification si nécessaire
    // token: 'your-auth-token'
  });

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

// Hook pour récupérer un atome par ID
export const useAtomById = (id: number) => {
  const [data, setData] = useState<AtomResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAtomById(id);
        setData(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching atom data by ID:', err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};

// Hook pour récupérer un atome par label
export const useAtomByLabel = (label: string) => {
  const [data, setData] = useState<AtomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAtomByLabel(label);
        if (response.atoms && response.atoms.length > 0) {
          setData(response.atoms[0]);
        } else {
          setError('Aucun atome trouvé avec ce label');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching atom data by label:', err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [label]);

  return { data, loading, error };
}; 