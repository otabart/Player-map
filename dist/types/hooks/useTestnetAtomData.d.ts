import { Network, AtomResponse, AtomData } from './useAtomData';

/**
 * Hook pour récupérer un atome par ID sur le testnet
 */
export declare const useTestnetAtomById: (id: number) => {
    data: AtomResponse | null;
    loading: boolean;
    error: string | null;
    network: Network;
};
/**
 * Hook pour récupérer un atome par label sur le testnet
 */
export declare const useTestnetAtomByLabel: (label: string) => {
    data: AtomData | null;
    loading: boolean;
    error: string | null;
    network: Network;
};
