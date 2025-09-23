import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch Atom Details
export const fetchAtomDetails = async (atomId: string, network: Network = Network.MAINNET) => {
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
    return data.data?.atoms?.[0] || null;
  } catch (error) {
    console.error('Error fetching atom details:', error);
    return null;
  }
};




