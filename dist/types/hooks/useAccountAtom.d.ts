import { Network } from './useAtomData';

export interface AccountAtomResponse {
    account: {
        atom: {
            id: string;
        } | null;
    } | null;
}
export declare const fetchAccountAtom: (accountId: string, network?: Network) => Promise<AccountAtomResponse>;
export declare const useAccountAtom: (accountId: string, network?: Network) => {
    loading: boolean;
    error: Error | null;
    hasAccountAtom: boolean;
    accountAtomId: string | null;
    network: Network;
    rawData: AccountAtomResponse | null;
};
export default useAccountAtom;
