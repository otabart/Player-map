import { Network, API_URLS } from '../hooks/useAtomData';

// Fetch follows and followers
export const fetchFollowsAndFollowers = async (
  predicateId: string,
  accountId: string,
  network: Network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];

    // Pour le moment, on garde l'ID hardcodé comme dans playermap-graph
    const userAtomId = "0x4b5ec64b82fae56c71a469fc902df2096b0dc7c930dd61032e817d583575fe47";

    if (!userAtomId) {
      console.warn('⚠️ Aucun atom trouvé pour cette adresse');
      return { follows: [], followers: [] };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetFollowsAndFollowers($predicateId: String!, $userAtomId: String!) {
            follows: triples(
              where: {
                _and: [
                  { predicate_id: { _eq: $predicateId } },
                  { subject_id: { _eq: $userAtomId } }
                ]
              }
            ) {
              term_id
              object {
                term_id
                label
                image
                creator_id
              }
            }
            followers: triples(
              where: {
                _and: [
                  { predicate_id: { _eq: $predicateId } },
                  { object_id: { _eq: $userAtomId } }
                ]
              }
            ) {
              term_id
              creator_id
              subject {
                term_id
                label
                image
              }
            }
          }
        `,
        variables: { predicateId, userAtomId }
      })
    });

    const data = await response.json();
    return {
      follows: data.data?.follows?.map((f: any) => ({
        ...f,
        object: { ...f.object, id: f.object.term_id }
      })) || [],
      followers: data.data?.followers?.map((f: any) => ({
        ...f,
        subject: { ...f.subject, id: f.subject.term_id }
      })) || []
    };
  } catch (error) {
    console.error('Error fetching follows and followers:', error);
    return { follows: [], followers: [] };
  }
};




