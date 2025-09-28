import { useState, useEffect } from 'react';
import { Network } from './useAtomData';
import { fetchTriplesForAgent, fetchPositions, fetchFollowsAndFollowers, fetchClaimsBySubject } from '../api/sidebarQueries';
import { useTripleByCreator } from './useTripleByCreator';
import { DefaultPlayerMapConstants } from '../types/PlayerMapConfig';

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
  network: Network = Network.MAINNET,
  constants: DefaultPlayerMapConstants
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

  // Utiliser les constantes passées en paramètre
  const { COMMON_IDS } = constants;

  // Utiliser useTripleByCreator pour récupérer les triples du joueur
  const { triples: playerTriples, loading: triplesLoading, error: triplesError } = useTripleByCreator(
    walletAddress || '',
    constants.PLAYER_TRIPLE_TYPES.PLAYER_GAME.predicateId,
    constants.PLAYER_TRIPLE_TYPES.PLAYER_GAME.objectId,
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
        const [triplesData, positionsData, connectionsData] = await Promise.all([
          fetchTriplesForAgent(walletAddress, network),
          fetchPositions(walletAddress, network),
          fetchFollowsAndFollowers(COMMON_IDS.FOLLOWS, walletAddress, network) // Ajouter les connections
        ]);

        setTriples(triplesData);
        setPositions(positionsData);
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

  // Charger les claims séparément quand atomDetails est disponible
  useEffect(() => {
    if (!atomDetails) {
      setActivities([]);
      return;
    }

    const loadClaims = async () => {
      try {
        const claimsData = await fetchClaimsBySubject(atomDetails.term_id, network);
        setActivities(claimsData);
      } catch (err) {
        console.error('Error loading claims:', err);
        setActivities([]);
      }
    };

    loadClaims();
  }, [atomDetails, network]);

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
