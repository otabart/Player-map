/**
 * Stocke le token d'authentification JWT
 * @param token - Le token JWT à stocker
 */
export declare const setAuthToken: (token: string) => void;
/**
 * Récupère le token d'authentification JWT
 * @returns Le token JWT ou null s'il n'existe pas
 */
export declare const getAuthToken: () => string | null;
/**
 * Vérifie si l'utilisateur est connecté (a un token)
 * @returns true si l'utilisateur est connecté, false sinon
 */
export declare const isAuthenticated: () => boolean;
/**
 * Supprime le token d'authentification JWT (déconnexion)
 */
export declare const clearAuthToken: () => void;
/**
 * Formate le token pour l'utiliser dans les headers HTTP
 * @returns Le token formaté ou une chaîne vide
 */
export declare const getAuthHeader: () => string;
