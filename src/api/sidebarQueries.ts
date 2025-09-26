// Import all query functions from separate files
import { fetchAtomDetails } from './fetchAtomDetails';
import { fetchTriplesForAgent } from './fetchTriplesForAgent';
import { fetchClaimsByAccount } from './fetchClaimsByAccount';
import { fetchFollowsAndFollowers } from './fetchFollowsAndFollowers';
import { fetchActivityHistory } from './fetchActivityHistory';
import { fetchPositions } from './fetchPositions';
import { fetchClaimsBySubject } from './fetchClaimsBySubject';

// Re-export all functions for backward compatibility
export {
  fetchAtomDetails,
  fetchTriplesForAgent,
  fetchClaimsByAccount,
  fetchFollowsAndFollowers,
  fetchActivityHistory,
  fetchPositions,
  fetchClaimsBySubject
};
