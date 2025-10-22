import { useMemo } from 'react';
import { PlayerMapConfig, PlayerMapConstants, DefaultPlayerMapConstants } from '../types/PlayerMapConfig';
import { DEFAULT_CONSTANTS, UNIT_VALUE } from '../utils/constants';

/**
 * Hook pour injecter les constantes PlayerMap avec fallback sur les valeurs par défaut
 * @param config Configuration optionnelle contenant les constantes personnalisées
 * @returns Constantes complètes (personnalisées + par défaut)
 */
export const usePlayerConstants = (config?: PlayerMapConfig): DefaultPlayerMapConstants => {
  return useMemo(() => {
    // Si des constantes personnalisées sont fournies, les utiliser
    if (config?.constants) {
      return {
        ...config.constants,
        UNIT_VALUE // Toujours depuis Player-map, jamais paramétrable
      };
    }

    // Sinon, utiliser les constantes par défaut
    return {
      ...DEFAULT_CONSTANTS,
      UNIT_VALUE
    };
  }, [config?.constants]);
};

/**
 * Hook simplifié pour obtenir seulement les constantes par défaut
 * @returns Constantes par défaut complètes
 */
export const useDefaultPlayerConstants = (): DefaultPlayerMapConstants => {
  return {
    ...DEFAULT_CONSTANTS,
    UNIT_VALUE
  };
};
