// Types de triples pour les joueurs
export const PLAYER_TRIPLE_TYPES = {
  IS_PLAYER_GAMES: {
    predicateId: 24536n, // predicat --> is player of !!!
    objectId: 24537n // object --> games (BossFighters)
  },
  IS_FAIRPLAY: {
    predicateId: 11995n, // predicat --> is 
    objectId: 24533n // object --> fairplay !!!
  },
  IS_STRONG_BOSS: {
    predicateId: 11995n, // predicat --> is 
    objectId: 24534n // object --> strong boss !!!
  },
  IS_STRONG_FIGHTER: {
    predicateId: 11995n, // predicat --> is 
    objectId: 24535n // object --> strong fighter !!!
  },
  IS_PLAYER_GUILD: {
    predicateId: 24536n, // predicat --> is player of !!!
    objectId: null // Sera défini dynamiquement en fonction du choix de guilde
  }
};

// Liste des guildes officielles du jeu
export const OFFICIAL_GUILDS = [
  { id: 24538n, name: "The Alchemists" }, // id --> The Alchemists !!!
  { id: 24539n, name: "Big Time Warriors" }, // id --> Big Time Warriors !!!
  { id: 24540n, name: "The NEST" }, // id --> The NEST !!!
  { id: 24541n, name: "Clock Work Gamers" }, // id --> Clock Work Gamers !!!
  { id: 24542n, name: "Vast Impact Gaming" }, // id --> Vast Impact Gaming !!!
  { id: 24543n, name: "Kraken Gaming" }, // id --> Kraken Gaming !!!
  { id: 24544n, name: "FAM" } // id --> FAM
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