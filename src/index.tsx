import React from "react";
import PlayerMapHome from "./PlayerMapHome";
import RegistrationForm from "./RegistrationForm";
import PlayerMapGraph from "./PlayerMapGraph";
import GraphComponent from "./GraphComponent";
import {
  setAuthToken,
  getAuthToken,
  isAuthenticated,
  clearAuthToken,
} from "./utils/auth";
import { initConfig, getConfig } from "./utils/config";

// Définition de l'interface de configuration pour l'API publique
export interface PlayerMapConfigType {
  apiUrl: string;
}

// Exporter les composants individuellement
export { PlayerMapHome, RegistrationForm, PlayerMapGraph, GraphComponent };

// Exporter la configuration avec types explicites
export const PlayerMapConfig = {
  /**
   * Initialise la configuration de la bibliothèque Player-map
   * @param config Configuration contenant l'URL de l'API (obligatoire)
   */
  init: (config: PlayerMapConfigType) => {
    if (!config.apiUrl) {
      throw new Error(
        "L'URL de l'API est obligatoire pour initialiser Player-map"
      );
    }
    initConfig(config);
    return true;
  },

  /**
   * Récupère la configuration actuelle
   * @throws Error si la configuration n'a pas été initialisée
   */
  get: getConfig,
};

// Exporter les fonctions d'authentification
export const auth = {
  setAuthToken,
  getAuthToken,
  isAuthenticated,
  clearAuthToken,

  // Fonction d'initialisation pour les applications intégrant la bibliothèque
  initialize: (token: string) => {
    if (token) {
      setAuthToken(token);
      return true;
    }
    return false;
  },
};

// Exporter un composant par défaut
export default PlayerMapHome;
