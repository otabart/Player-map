import { useState, useEffect } from 'react';
import { Network } from './useAtomData';
import { fetchClaimsBySubject } from '../api/fetchClaimsBySubject';

interface SelectedAtomClaims {
  claims: any[];
  loading: boolean;
  error: string | null;
}

export const useSelectedAtomClaims = (
  selectedNode: any,
  network: Network = Network.MAINNET
): SelectedAtomClaims => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNode?.id) {
      setClaims([]);
      setError(null);
      return;
    }

    const loadClaims = async () => {
      setLoading(true);
      setError(null);

      try {
        const claimsData = await fetchClaimsBySubject(selectedNode.id, network);
        setClaims(claimsData);
      } catch (err) {
        console.error('Error loading selected atom claims:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, [selectedNode?.id, network]);

  return {
    claims,
    loading,
    error
  };
};


