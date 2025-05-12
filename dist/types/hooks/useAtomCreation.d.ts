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
    image?: string | undefined;
};
export interface UseAtomCreationProps {
    walletConnected?: any;
    walletAddress?: string;
    publicClient?: any;
}
export declare const useAtomCreation: ({ walletConnected, walletAddress, publicClient }: UseAtomCreationProps) => {
    createAtom: (input: IpfsAtomInput) => Promise<{
        atomId: bigint;
        ipfsHash: string;
    }>;
};
