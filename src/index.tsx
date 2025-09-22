import React from "react";
import PlayerMapHome from "./PlayerMapHome";
import RegistrationForm from "./RegistrationForm";
import PlayerMapGraph from "./PlayerMapGraph";
import GraphComponent from "./GraphComponent";
import { ClaimVoting } from "./components/vote/ClaimVoting";
import VotingModal from "./components/vote/VotingModal";
import { useDepositTriple } from "./hooks/useDepositTriple";
import { useCheckSpecificTriplePosition } from "./hooks/useCheckSpecificTriplePosition";
import { useDisplayTriplesWithPosition } from "./hooks/useDisplayTriplesWithPosition";
import { checkTriplePosition } from "./utils/debugPosition";
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

// Export des composants principaux
export {
  PlayerMapHome,
  RegistrationForm,
  PlayerMapGraph,
  GraphComponent,
  ClaimVoting,
  VotingModal,
  useDepositTriple,
  useCheckSpecificTriplePosition,
  useDisplayTriplesWithPosition,
  checkTriplePosition,
  setAuthToken,
  getAuthToken,
  isAuthenticated,
  clearAuthToken,
};

// Exporter les types pour le composant de vote
export { VoteDirection, type Claim, type VoteItem, type DepositResponse } from './types/vote';
export { PREDEFINED_CLAIM_IDS, UNIT_VALUE } from './utils/constants';

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
