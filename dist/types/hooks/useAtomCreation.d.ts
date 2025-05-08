export type IpfsAtom = {
    '@context': string;
    '@type': string;
    name: string;
    description?: string;
    image?: string;
};
export type IpfsAtomInput = {
    name: string;
    description?: string;
    image?: string;
};
export interface UseAtomCreationProps {
    walletConnected?: any;
    walletAddress?: string;
}
export declare const useAtomCreation: ({ walletConnected, walletAddress }: UseAtomCreationProps) => {
    createAtom: (input: IpfsAtomInput) => Promise<{
        atomId: bigint;
        ipfsHash: string;
    }>;
};
