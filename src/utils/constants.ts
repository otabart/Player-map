// Types de triples pour les joueurs
export const PLAYER_TRIPLE_TYPES = {
  IS_PLAYER: {
    predicateId: 24442n,
    objectId: 24441n
  },
  // Définition du type HAS_LEVEL pour les joueurs
  HAS_LEVEL: {
    predicateId: 377n,
    objectId: 24403n
  }
  // Définir ici d'autres types de relations spécifiques aux joueurs
};

// Constantes pour les réponses API
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

// Temps d'attente pour des actions spécifiques (en ms)
export const TIMEOUT = {
  MODAL_CLOSE: 3000 // 3 secondes avant la fermeture d'un modal
}; 