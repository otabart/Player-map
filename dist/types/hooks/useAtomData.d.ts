import { createServerClient } from '@0xintuition/graphql';

export interface AtomData {
    id: number;
    label: string;
    type: string;
    data: string | null;
    emoji: string | null;
    image: string | null;
    creator_id: string;
    creator: {
        id: string;
        label: string;
    };
    value: {
        id: number;
    } | null;
    block_number: number;
    block_timestamp: string;
    transaction_hash: string;
}
export interface AtomResponse {
    atom: AtomData;
}
export declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet"
}
export declare const API_URLS: {
    mainnet: string;
    testnet: string;
};
export declare const createClient: (network?: Network) => ReturnType<typeof createServerClient>;
export declare const fetchAtomById: (id: number, network?: Network) => Promise<AtomResponse>;
export declare const fetchAtomByLabel: (label: string, network?: Network) => Promise<{
    atoms: AtomData[];
}>;
export interface AtomByIdHook {
    data: AtomResponse | null;
    loading: boolean;
    error: string | null;
    network: Network;
}
export interface AtomByLabelHook {
    data: AtomData | null;
    loading: boolean;
    error: string | null;
    network: Network;
}
export { useMainnetAtomById, useMainnetAtomByLabel } from './useMainnetAtomData';
export { useTestnetAtomById, useTestnetAtomByLabel } from './useTestnetAtomData';
export declare const useAtomById: (id: number, network?: Network) => {
    data: AtomResponse | null;
    loading: boolean;
    error: string | null;
};
export declare const useAtomByLabel: (label: string, network?: Network) => {
    data: AtomData | null;
    loading: boolean;
    error: string | null;
};
