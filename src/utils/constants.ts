// Types de triples pour les joueurs
export const PLAYER_TRIPLE_TYPES = {
  IS_PLAYER_GAMES: {
    predicateId: 24536n,
    objectId: 24537n
  },
  IS_FAIRPLAY: {
    predicateId: 11995n,
    objectId: 24533n
  },
  IS_STRONG_BOSS: {
    predicateId: 11995n,
    objectId: 24534n
  },
  IS_STRONG_FIGHTER: {
    predicateId: 11995n,
    objectId: 24535n
  },
  IS_PLAYER_GUILD: {
    predicateId: 24536n,
    objectId: null // Sera défini dynamiquement en fonction du choix de guilde
  }
};

// Liste des guildes officielles du jeu
export const OFFICIAL_GUILDS = [
  { id: 24538n, name: "The Alchemists" },
  { id: 24539n, name: "Big Time Warriors" },
  { id: 24540n, name: "The NEST" },
  { id: 24541n, name: "Clock Work Gamers" },
  { id: 24542n, name: "Vast Impact Gaming" },
  { id: 24543n, name: "Kraken Gaming" },
  { id: 24544n, name: "FAM" }
];

// Constantes pour les réponses API
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

// Temps d'attente pour des actions spécifiques (en ms)
export const TIMEOUT = {
  MODAL_CLOSE: 3000 // 3 secondes avant la fermeture d'un modal
}; 