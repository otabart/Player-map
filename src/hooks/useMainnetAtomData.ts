import { useState, useEffect } from 'react';
import { 
  fetchAtomById, 
  fetchAtomByLabel, 
  Network, 
  AtomResponse, 
  AtomData 
} from './useAtomData';

/**
 * Hook pour récupérer un atome par ID sur le mainnet
 */
export const useMainnetAtomById = (id: number) => {
  const [data, setData] = useState<AtomResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAtomById(id, Network.MAINNET);
        setData(response);
        setLoading(false);
      } catch (err) {
        console.error(`[MAINNET] Erreur lors de la récupération de l'atome ID=${id}:`, err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error, network: Network.MAINNET };
};

/**
 * Hook pour récupérer un atome par label sur le mainnet
 */
export const useMainnetAtomByLabel = (label: string) => {
  const [data, setData] = useState<AtomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAtomByLabel(label, Network.MAINNET);
        if (response.atoms && response.atoms.length > 0) {
          setData(response.atoms[0]);
        } else {
          setError(`Aucun atome trouvé avec ce label sur ${Network.MAINNET}`);
        }
        setLoading(false);
      } catch (err) {
        console.error(`[MAINNET] Erreur lors de la récupération de l'atome label="${label}":`, err);
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
        setLoading(false);
      }
    };

    fetchData();
  }, [label]);

  return { data, loading, error, network: Network.MAINNET };
}; 