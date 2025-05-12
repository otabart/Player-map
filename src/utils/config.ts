// Configuration globale de la bibliothèque
export interface IPlayerMapConfig {
  apiUrl: string;
}

// Configuration initiale vide pour forcer l'initialisation explicite
let currentConfig: IPlayerMapConfig | null = null;

// Exporter la configuration actuelle (lecture seule)
export const getConfig = (): Readonly<IPlayerMapConfig> => {
  if (!currentConfig) {
    throw new Error(
      "Configuration Player-map non initialisée. Utilisez PlayerMapConfig.init() pour configurer la bibliothèque."
    );
  }
  return { ...currentConfig };
};

// Fonction pour initialiser/mettre à jour la configuration
// Accepte toute configuration avec au moins une propriété apiUrl
export const initConfig = (config: { apiUrl: string }): void => {
  // Validation stricte des valeurs requises
  if (!config.apiUrl) {
    throw new Error("L'URL de l'API est requise pour initialiser Player-map");
  }

  currentConfig = {
    apiUrl: config.apiUrl
  };
}; 