import { Network, AtomData } from './useAtomData';

export interface AtomsByCreatorResponse {
    atoms: AtomData[];
}
export declare const fetchAtomsByCreator: (creatorId: string, network?: Network) => Promise<AtomsByCreatorResponse>;
export declare const useAtomsByCreator: (creatorId: string, network?: Network) => {
    loading: boolean;
    error: Error | null;
    atoms: AtomData[];
    network: Network;
    rawData: AtomsByCreatorResponse | null;
};
export default useAtomsByCreator;
