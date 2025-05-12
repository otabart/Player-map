export interface TripleToCreate {
    subjectId: bigint;
    predicateId: bigint;
    objectId: bigint;
}
interface UseBatchCreateTripleProps {
    walletConnected?: any;
    walletAddress?: string;
    publicClient?: any;
}
export declare const useBatchCreateTriple: ({ walletConnected, walletAddress, publicClient }: UseBatchCreateTripleProps) => {
    checkTripleExists: (subjectId: bigint, predicateId: bigint, objectId: bigint) => Promise<boolean>;
    batchCreateTriple: (triples: TripleToCreate[]) => Promise<any>;
    createPlayerTriples: (playerAtomId: bigint) => Promise<any>;
};
export {};
