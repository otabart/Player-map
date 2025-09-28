// Variable globale partagée pour stocker les constantes Pinata
let globalPinataConstants: any = null;

// Fonction pour définir les constantes Pinata globalement
export const setPinataConstants = (constants: any) => {
  globalPinataConstants = constants;
};

// Fonction pour récupérer les constantes Pinata globales
export const getPinataConstants = () => {
  return globalPinataConstants;
};


