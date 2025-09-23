import { useState } from 'react';
import { atomABI, ATOM_CONTRACT_ADDRESS } from '../abi';

interface RedeemBatchParams {
  receiver: `0x${string}`;
  termIds: `0x${string}`[];
  curveIds: bigint[];
  shares: bigint[];
  minAssets: bigint[];
}

interface UseRedeemBatchProps {
  walletConnected?: any;
  walletAddress?: string;
}

export const useRedeemBatch = ({
  walletConnected,
  walletAddress,
}: UseRedeemBatchProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const redeemBatch = async (params: RedeemBatchParams) => {
    if (!walletConnected || !walletAddress) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);

    try {
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: "redeemBatch",
        args: [
          params.receiver,  // receiver
          params.termIds,   // termIds array
          params.curveIds,  // curveIds array
          params.shares,    // shares array
          params.minAssets  // minAssets array
        ],
        gas: 500000n * BigInt(params.termIds.length) // Gas based on number of redemptions
      });

      // Wait for confirmation
      let receipt;
      if (walletConnected.waitForTransactionReceipt) {
        receipt = await walletConnected.waitForTransactionReceipt({ hash: txHash });
      } else if (txHash.wait) {
        receipt = await txHash.wait();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      setIsLoading(false);
      return {
        success: true,
        hash: typeof txHash === "string" ? txHash : txHash.hash,
      };
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return {
    redeemBatch,
    isLoading
  };
};