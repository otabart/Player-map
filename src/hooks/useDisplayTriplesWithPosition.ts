import { useState, useEffect } from 'react';
import { Network, API_URLS } from './useAtomData';

// Hook personnalisé pour récupérer les triples avec les positions (GraphQL v2)
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

        // Requête GraphQL v2 directe qui conserve la logique métier
        const query = `
          query GetTriplesWithPositions($accountId: String!) {
            triples {
              term_id
              counter_term_id
              subject_id
              predicate_id
              object_id
              positions(where: { account_id: { _eq: $accountId } }) {
                account_id
                term_id
                shares
                account {
                  id
                  label
                }
              }
              term {
                id
                total_market_cap
                total_assets
                positions(where: { account_id: { _eq: $accountId } }) {
                  account_id
                  shares
                }
              }
              counter_term {
                id
                total_market_cap
                total_assets
                positions(where: { account_id: { _eq: $accountId } }) {
                  account_id
                  shares
                }
              }
            }
          }
        `;

        const response = await fetch(API_URLS[Network.MAINNET], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { accountId: walletAddress }
          })
        });

        const result = await response.json();

        if (result.errors) {
          console.error("GraphQL Errors:", result.errors);
          throw new Error(result.errors[0].message);
        }

        const transformedData = {
          triples: result.data.triples,
          positions: result.data.triples.flatMap((triple: any) => [
            ...(triple.positions || []),
            ...(triple.term?.positions || []),
            ...(triple.counter_term?.positions || [])
          ])
        };
        setData(transformedData);
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