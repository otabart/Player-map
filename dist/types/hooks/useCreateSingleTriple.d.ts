interface UseCreateSingleTripleProps {
    walletConnected?: any;
    walletAddress?: string;
    publicClient?: any;
}
export declare const useCreateSingleTriple: ({ walletConnected, walletAddress, publicClient }: UseCreateSingleTripleProps) => {
    checkTripleExists: (subjectId: bigint, predicateId: bigint, objectId: bigint) => Promise<boolean>;
    createSingleTriple: (subjectId: bigint, predicateId: bigint, objectId: bigint) => Promise<bigint>;
};
export {};
