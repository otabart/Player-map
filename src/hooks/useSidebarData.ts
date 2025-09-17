import { useState, useEffect } from 'react';
import { Network } from './useAtomData';
import { fetchTriplesForAgent, fetchPositionsByAccount, fetchClaimsByAccount, fetchFollowsAndFollowers } from '../api/sidebarQueries';
import { useTripleByCreator } from './useTripleByCreator';
import { COMMON_PREDICATES } from '../utils/constants';

interface SidebarData {
  atomDetails: any | null;
  triples: any[];
  positions: any[];
  activities: any[];
  connections: {
    follows: any[];
    followers: any[];
  };
  loading: boolean;
  error: string | null;
}

export const useSidebarData = (
  walletAddress: string | undefined,
  network: Network = Network.MAINNET
): SidebarData => {
  const [triples, setTriples] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [connections, setConnections] = useState<{ follows: any[]; followers: any[] }>({
    follows: [],
    followers: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser useTripleByCreator pour récupérer les triples du joueur
  const { triples: playerTriples, loading: triplesLoading, error: triplesError } = useTripleByCreator(
    walletAddress || '',
    undefined, // Utiliser les valeurs par défaut
    undefined,
    network
  );

  // L'atom du joueur est le sujet du premier triple trouvé
  const atomDetails = playerTriples.length > 0 ? playerTriples[0].subject : null;

  useEffect(() => {
    if (!walletAddress) {
      setTriples([]);
      setPositions([]);
      setActivities([]);
      return;
    }

    const loadSidebarData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Charger les données en parallèle
        const [triplesData, positionsData, claimsData, connectionsData] = await Promise.all([
          fetchTriplesForAgent(walletAddress, network),
          fetchPositionsByAccount(walletAddress, network),
          fetchClaimsByAccount(walletAddress, network), // Ajouter les claims
          fetchFollowsAndFollowers(COMMON_PREDICATES.FOLLOWS, walletAddress, network) // Ajouter les connections
        ]);

        setTriples(triplesData);
        setPositions(positionsData);
        setActivities(claimsData); // Utiliser les claims pour les activités
        setConnections(connectionsData); // Utiliser les connections
      } catch (err) {
        console.error('Error loading sidebar data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadSidebarData();
  }, [walletAddress, network]);

  return {
    atomDetails,
    triples,
    positions,
    activities,
    connections,
    loading: loading || triplesLoading,
    error: error || (triplesError ? triplesError.message : null)
  };
};
