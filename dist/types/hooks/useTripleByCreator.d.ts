import { Network } from './useAtomData';

export interface Triple {
    id: string;
    subject_id: string;
    predicate_id: string;
    object_id: string;
    subject: {
        id: string;
        label: string;
        type: string;
        creator_id: string;
    };
    predicate: {
        id: string;
        label: string;
        type: string;
    };
    object: {
        id: string;
        label: string;
        type: string;
    };
    block_number: number;
    block_timestamp: string;
    transaction_hash: string;
}
export interface TriplesByCreatorResponse {
    triples: Triple[];
}
export declare const fetchTriplesByCreator: (creatorId: string, predicateId?: number, objectId?: number, network?: Network) => Promise<TriplesByCreatorResponse>;
export declare const useTripleByCreator: (creatorId: string, predicateId?: number, objectId?: number, network?: Network) => {
    loading: boolean;
    error: Error | null;
    triples: Triple[];
    network: Network;
    rawData: TriplesByCreatorResponse | null;
};
export default useTripleByCreator;
