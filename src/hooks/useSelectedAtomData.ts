import { useState, useEffect } from 'react';
import { Network } from './useAtomData';
import { fetchAtomDetails, AtomDetails } from '../api/fetchAtomDetails';

interface SelectedAtomData {
  atomDetails: AtomDetails | null;
  loading: boolean;
  error: string | null;
}

export const useSelectedAtomData = (
  selectedNode: any,
  network: Network = Network.MAINNET
): SelectedAtomData => {
  const [atomDetails, setAtomDetails] = useState<AtomDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNode?.id) {
      setAtomDetails(null);
      setError(null);
      return;
    }

    const loadAtomDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const details = await fetchAtomDetails(selectedNode.id, network);
        setAtomDetails(details);
      } catch (err) {
        console.error('Error loading selected atom details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setAtomDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadAtomDetails();
  }, [selectedNode?.id, network]);

  return {
    atomDetails,
    loading,
    error
  };
};
