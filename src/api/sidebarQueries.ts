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

// Fetch Triples filtered for Agent view
export const fetchTriplesForAgent = async (
  objectId: string,
  network: Network = Network.MAINNET,
  batchSize = 1000
) => {
  try {
    const apiUrl = API_URLS[network];
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query Triples_for_Agent($objectId: String!, $batchSize: Int!) {
            triples(limit: $batchSize, where: { object_id: { _eq: $objectId } }) {
              term_id
              subject {
                term_id
                label
                type
                image
              }
              predicate {
                term_id
                label
                type
                image
              }
              object {
                term_id
                label
                type
                image
              }
              term {
                total_market_cap
                total_assets
                positions_aggregate {
                  aggregate {
                    count
                  }
                }
              }
              counter_term {
                total_market_cap
                total_assets
                positions_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            }
          }
        `,
        variables: { objectId, batchSize }
      })
    });

    const data = await response.json();
    return data.data?.triples || [];
  } catch (error) {
    console.error('Error fetching triples for agent:', error);
    return [];
  }
};

// Fetch Positions by Account
export const fetchPositionsByAccount = async (
  accountId: string,
  network: Network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetAccountActivity($accountId: String!) {
            positions(where: { account_id: { _eq: $accountId } }) {
              id
              shares
              account {
                id
                label
                image
                atom_id
                type
              }
              term {
                id
                total_market_cap
                total_assets
              }
            }
          }
        `,
        variables: { accountId }
      })
    });
    const data = await response.json();
    return data.data?.positions || [];
  } catch (error) {
    console.error('Error fetching positions by account:', error);
    return [];
  }
};

export const fetchClaimsByAccount = async (
  accountId: string,
  network = Network.MAINNET
) => {
  try {
    const apiUrl = API_URLS[network];
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        query ClaimsByAccount($accountId: String!) {
          triples(where: { creator_id: { _eq: $accountId } }) {
            term_id
            subject {
              term_id
              label
              type
              image
            }
            predicate {
              term_id
              label
              type
            }
            object {
              term_id
              label
              type
              image
            }
          }
        }
      `,
        variables: { accountId }
      })
    });

    const data = await response.json();
    return data.data?.triples || [];
  } catch (error) {
    console.error('Error fetching claims by account:', error);
    return [];
  }
};

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
