import { useState, useEffect } from 'react';
import { GetTriplesWithPositionsDocument, fetcher } from '@0xintuition/graphql';

// Hook personnalisé pour récupérer les triples avec les positions
export const useDisplayTriplesWithPosition = (walletAddress: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const variables = {
          limit: 100,
          offset: 0,
          where: {},
          address: walletAddress.toLowerCase()
        };

        // Utiliser le fetcher et le document GraphQL du package @0xintuition/graphql
        const fetchFn = fetcher(GetTriplesWithPositionsDocument, variables);
        const response = await fetchFn();

        // Cast response to any to avoid TypeScript errors
        const responseData = response as any;

        // Log position data structure for debugging
        console.log('POSITION DATA DEBUG:', JSON.stringify({
          hasPositions: Boolean(responseData.positions?.length),
          hasTriples: Boolean(responseData.triples?.length),
          hasPositionTriples: Boolean(responseData.position_triples?.length),
          tripleCounts: responseData.triples?.length || 0,
          positionCounts: responseData.positions?.length || 0,
          positionTripleCounts: responseData.position_triples?.length || 0,
          firstTriplesItem: responseData.triples?.[0] ? {
            id: responseData.triples[0].id,
            hasPositions: Boolean(responseData.triples[0].positions?.length),
            vaultPositions: responseData.triples[0].vault?.positions?.length || 0,
            counterVaultPositions: responseData.triples[0].counter_vault?.positions?.length || 0
          } : null
        }));

        setData(response);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des triples:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  return { data, loading, error };
}; 