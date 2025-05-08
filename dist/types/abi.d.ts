export declare const ATOM_CONTRACT_ADDRESS: string;
export declare const VALUE_PER_ATOM: bigint;
export declare const ATOM_CONTRACT_CHAIN_ID: number;
export declare const atomABI: ({
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
} | {
    type: string;
    stateMutability: string;
    name?: undefined;
    inputs?: undefined;
    outputs?: undefined;
})[];
