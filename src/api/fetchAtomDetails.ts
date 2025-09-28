import { Network, API_URLS } from '../hooks/useAtomData';

// Interface pour les détails d'un atom
export interface AtomDetails {
  term_id: string;
  image: string;
  label: string;
  emoji: string;
  type: string;
  creator_id: string;
  value?: {
    person?: {
      description: string;
    };
    organization?: {
      description: string;
    };
    thing?: {
      description: string;
    };
    book?: {
      description: string;
    };
  };
  term?: {
    total_market_cap: number;
  };
}

// Fetch Atom Details
export const fetchAtomDetails = async (atomId: string, network: Network = Network.MAINNET): Promise<AtomDetails | null> => {
  try {
    const apiUrl = API_URLS[network];
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetAtom($atomId: String!) {
            atoms(where: { term_id: { _eq: $atomId } }) {
              term_id
              image
              label
              emoji
              type
              creator_id
              value {
                person {
                  description
                }
                organization {
                  description
                }
                thing {
                  description
                }
                book {
                  description
                }
              }
              term {
                total_market_cap
              }
            }
          }
        `,
        variables: { atomId }
      })
    });

    const data = await response.json();
    const atom = data.data?.atoms?.[0];

    if (!atom) return null;

    // Retourner l'atom avec la structure complète
    return atom as AtomDetails;
  } catch (error) {
    console.error('Error fetching atom details:', error);
    return null;
  }
};




