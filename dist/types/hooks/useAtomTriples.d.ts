import { Network } from './useAtomData';

export interface Triple {
    subject_id: string;
    predicate_id: string;
    object_id: string;
}
export interface AtomTriplesResponse {
    atom: {
        as_subject_triples: Triple[];
    } | null;
}
export declare const fetchAtomTriples: (atomId: number, network?: Network) => Promise<AtomTriplesResponse>;
export declare const useAtomTriples: (atomId: string | null, network?: Network) => {
    loading: boolean;
    error: Error | null;
    triples: Triple[];
    hasTriple: (predicateId: string, objectId: string) => boolean;
    network: Network;
    rawData: AtomTriplesResponse | null;
};
export default useAtomTriples;
