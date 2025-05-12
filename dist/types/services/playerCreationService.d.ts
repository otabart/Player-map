export interface PlayerData {
    pseudo: string;
    userId: string;
    image?: string | undefined;
    guildId?: bigint;
}
export declare const usePlayerCreationService: (walletConnected: any, walletAddress: string, publicClient?: any) => {
    createPlayer: (playerData: PlayerData) => Promise<{
        atomId: bigint;
        ipfsHash: string;
        tripleCreated: boolean;
        transactionHash?: string;
    }>;
};
