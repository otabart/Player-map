import { Network, AtomResponse, AtomData } from './useAtomData';

/**
 * Hook pour récupérer un atome par ID sur le mainnet
 */
export declare const useMainnetAtomById: (id: number) => {
    data: AtomResponse | null;
    loading: boolean;
    error: string | null;
    network: Network;
};
/**
 * Hook pour récupérer un atome par label sur le mainnet
 */
export declare const useMainnetAtomByLabel: (label: string) => {
    data: AtomData | null;
    loading: boolean;
    error: string | null;
    network: Network;
};
