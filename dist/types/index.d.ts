import { default as PlayerMapHome } from './PlayerMapHome';
import { default as RegistrationForm } from './RegistrationForm';
import { default as PlayerMapGraph } from './PlayerMapGraph';
import { default as GraphComponent } from './GraphComponent';

export interface PlayerMapConfigType {
    apiUrl: string;
}
export { PlayerMapHome, RegistrationForm, PlayerMapGraph, GraphComponent };
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
