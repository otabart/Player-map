import { createServerClient } from '@0xintuition/graphql';

export declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet"
}
export declare const API_URLS: {
    mainnet: string;
    testnet: string;
};
export declare const createClient: (network?: Network) => ReturnType<typeof createServerClient>;
