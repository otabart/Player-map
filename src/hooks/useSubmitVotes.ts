import { useState } from "react";
import { VoteItem, VoteDirection, DepositResponse } from "../types/vote";
import { useDepositTriple } from "./useDepositTriple";
import { Network } from "./useAtomData";

type TransactionStatus = {
  status: "idle" | "pending" | "success" | "error" | "approval_pending" | "whitelist_error";
  message: string;
};

interface UseSubmitVotesProps {
  walletConnected?: any;
  walletAddress?: string;
  publicClient?: any;
  network?: Network;
  onSuccess?: () => void;
}

export const useSubmitVotes = ({
  walletConnected,
  walletAddress,
  publicClient,
  network = Network.MAINNET,
  onSuccess
}: UseSubmitVotesProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>({
    status: "idle",
    message: "",
  });

  const { depositTriple, isLoading: isDepositLoading } = useDepositTriple({
    walletConnected,
    walletAddress,
    publicClient,
    network,
  });

  const submitVotes = async (voteItems: VoteItem[]) => {
    const hasVotes = voteItems.some((item) => item.units > 0);
    if (!hasVotes) {
      setTransactionStatus({
        status: "error",
        message: "Please place at least one vote.",
      });
      return null;
    }

    if (!walletConnected || !walletAddress) {
      setTransactionStatus({
        status: "error",
        message: "Wallet not connected.",
      });
      return null;
    }

    try {
      setIsSubmitting(true);

      setTransactionStatus({
        status: "pending",
        message: "Transaction in progress...",
      });

      const votesToProcess = voteItems.filter((item) => item.units > 0);

      // Process each vote individually with depositTriple
      const votes = votesToProcess.map(vote => ({
        claimId: `0x${vote.id.toString(16).padStart(64, '0')}`,
        units: vote.units,
        direction: vote.direction
      }));
      
      const result = await depositTriple(votes);

      if (result.success) {
        setTransactionStatus({
          status: "success",
          message: `Transaction successful! Hash: ${result.hash?.substring(0, 10)}...`,
        });

        if (onSuccess) {
          onSuccess();
        }

        return result;
      } else {
        let errorMessage = result.error || "An error occurred.";

        if (errorMessage.includes("user rejected")) {
          setTransactionStatus({
            status: "error",
            message: "Transaction cancelled: User rejected the request.",
          });
        } else {
          setTransactionStatus({
            status: "error",
            message: `Error: ${errorMessage}`,
          });
        }

        return null;
      }
    } catch (error) {
      console.error("Error submitting votes:", error);
      setTransactionStatus({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred.",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVotes,
    isSubmitting,
    isDepositLoading,
    transactionStatus,
    setTransactionStatus
  };
}; 