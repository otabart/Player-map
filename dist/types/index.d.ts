import { default as PlayerMapHome } from './PlayerMapHome';
import { default as RegistrationForm } from './RegistrationForm';
import { default as PlayerMapGraph } from './PlayerMapGraph';
import { default as GraphComponent } from './GraphComponent';
import { ClaimVoting } from './components/vote/ClaimVoting';
import { useDepositTriple } from './hooks/useDepositTriple';
import { useCheckSpecificTriplePosition } from './hooks/useCheckSpecificTriplePosition';
import { useDisplayTriplesWithPosition } from './hooks/useDisplayTriplesWithPosition';
import { checkTriplePosition } from './utils/debugPosition';
import { setAuthToken, getAuthToken, isAuthenticated, clearAuthToken } from './utils/auth';

export interface PlayerMapConfigType {
    apiUrl: string;
}
export { PlayerMapHome, RegistrationForm, PlayerMapGraph, GraphComponent, ClaimVoting, useDepositTriple, useCheckSpecificTriplePosition, useDisplayTriplesWithPosition, checkTriplePosition, setAuthToken, getAuthToken, isAuthenticated, clearAuthToken, };
export { VoteDirection, type Claim, type VoteItem, type DepositResponse } from './types/vote';
export { PREDEFINED_CLAIM_IDS, UNIT_VALUE } from './utils/voteConstants';
export declare const PlayerMapConfig: {
    /**
     * Initialise la configuration de la bibliothèque Player-map
     * @param config Configuration contenant l'URL de l'API (obligatoire)
     */
    init: (config: PlayerMapConfigType) => boolean;
    /**
     * Récupère la configuration actuelle
     * @throws Error si la configuration n'a pas été initialisée
     */
    get: () => Readonly<import('./utils/config').IPlayerMapConfig>;
};
export declare const auth: {
    setAuthToken: (token: string) => void;
    getAuthToken: () => string | null;
    isAuthenticated: () => boolean;
    clearAuthToken: () => void;
    initialize: (token: string) => boolean;
};
export default PlayerMapHome;
