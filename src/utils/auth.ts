// Fonctions utilitaires pour l'authentification

/**
 * Stocke le token d'authentification JWT
 * @param token - Le token JWT à stocker
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Récupère le token d'authentification JWT
 * @returns Le token JWT ou null s'il n'existe pas
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Vérifie si l'utilisateur est connecté (a un token)
 * @returns true si l'utilisateur est connecté, false sinon
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Supprime le token d'authentification JWT (déconnexion)
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Formate le token pour l'utiliser dans les headers HTTP
 * @returns Le token formaté ou une chaîne vide
 */
export const getAuthHeader = (): string => {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : '';
}; 