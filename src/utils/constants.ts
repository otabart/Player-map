// ** MAINNET **

// Types de triples pour les joueurs
// export const PLAYER_TRIPLE_TYPES = {
//   IS_PLAYER_GAMES: {
//     predicateId: 164046n, // predicat --> is player of
//     objectId: 32890n // object --> games (BossFighters)
//   },
//   IS_FAIRPLAY: {
//     predicateId: 877n, // predicat --> is 
//     objectId: 164047n // object --> fairplay
//   },
//   IS_STRONG_BOSS: {
//     predicateId: 877n, // predicat --> is 
//     objectId: 164048n // object --> strong boss
//   },
//   IS_STRONG_FIGHTER: {
//     predicateId: 877n, // predicat --> is 
//     objectId: 164049n // object --> strong fighter
//   },
//   IS_PLAYER_GUILD: {
//     predicateId: 164046n, // predicat --> is player of
//     objectId: null // Sera défini dynamiquement en fonction du choix de guilde
//   }
// };

// // Liste des guildes officielles du jeu
// export const OFFICIAL_GUILDS = [
//   { id: 164062n, name: "The Alchemists" }, // id --> The Alchemists
//   { id: 164063n, name: "Big Time Warriors" }, // id --> Big Time Warriors
//   { id: 164065n, name: "The NEST" }, // id --> The NEST
//   { id: 164066n, name: "Clock Work Gamers" }, // id --> Clock Work Gamers
//   { id: 164067n, name: "Vast Impact Gaming" }, // id --> Vast Impact Gaming
//   { id: 164068n, name: "Kraken Gaming" }, // id --> Kraken Gaming
//   { id: 164070n, name: "FAM" } // id --> FAM 
// ];

// ** TESTNET **


// Types de triples pour les joueurs
export const PLAYER_TRIPLE_TYPES = {
  IS_PLAYER_GAMES: {
    predicateId: 0x05f1707d8cb50571d01021f09a664826aa1be2ff43504c0cca55eef87142f84fn, // predicat --> is player of !!!
    objectId: 0x5dc0a2335c12343d8e0f71b62a73fbf70d06fcbaf647f57d82a189873ad90da3n // object --> games (BossFighters)
  },
  IS_FAIRPLAY: {
    predicateId: 0x2af261bce70c2fc3a1abf882e3e89b23066fcd150bfda27fab69f9f55ed2d9d0n, // predicat --> is 
    objectId: 0xc9559c712c264e5f94ce450ed9473c451b6fd01ab6a436a726fbae767cd67b9cn // object --> fairplay !!!
  },
  IS_STRONG_BOSS: {
    predicateId: 0x2af261bce70c2fc3a1abf882e3e89b23066fcd150bfda27fab69f9f55ed2d9d0n, // predicat --> is 
    objectId: 0x56d28a901a7f2617247f1663b0c25c77ba6403a8141bac43b1e94eb32a2de941n // object --> strong boss !!!
  },
  IS_STRONG_FIGHTER: {
    predicateId: 0x2af261bce70c2fc3a1abf882e3e89b23066fcd150bfda27fab69f9f55ed2d9d0n, // predicat --> is 
    objectId: 0xc8433466cda62c0e8bb4fc5433f3faa51949072d6c7b0df50a595c95fb97f1bbn // object --> strong fighter !!!
  },
  IS_PLAYER_GUILD: {
    predicateId: 0x05f1707d8cb50571d01021f09a664826aa1be2ff43504c0cca55eef87142f84fn, // predicat --> is player of !!!
    objectId: null // Sera défini dynamiquement en fonction du choix de guilde
  }
};

// Liste des guildes officielles du jeu
export const OFFICIAL_GUILDS = [
  { id: 0x4320ae619f6a9c9b79ee8e2a9415585aff1c287f0b72b08c049cf7a5780eb08dn, name: "The Alchemists" }, // id --> The Alchemists !!!
  { id: 0x12d4b4425dcfeaf46af6543e8de0133f22f768a69d56a3aa28662ecb06aa9ca1n, name: "Big Time Warriors" }, // id --> Big Time Warriors !!!
  { id: 0xd9e1d54c0cb904c23e04caea94f9d0dae00874ec18849ca74a832e94c6de01fan, name: "The NEST" }, // id --> The NEST !!!
  { id: 0xd473ceacf850609ff8881c398e85e59aadbc315588ca78182313cc1af05a2800n, name: "Clock Work Gamers" }, // id --> Clock Work Gamers !!!
  { id: 0x14511bc4065a1e7d67ba7d50d4706a8899a148a2e68b55213794c14e347acaaen, name: "Vast Impact Gaming" }, // id --> Vast Impact Gaming !!!
  { id: 0x93815368a0d207e11be12da396d51dea4e3f8e637fe49f696648feb451f6f9c7n, name: "Kraken Gaming" }, // id --> Kraken Gaming !!!
  { id: 0x508dee963f045411bd0bf4ab9433f40b72ca4270eb0f31222f299211cffbb0bcn, name: "FAM" } // id --> FAM
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