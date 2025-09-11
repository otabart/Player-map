import { VoteDirection, DepositResponse } from "../types/vote";
import { UNIT_VALUE } from "../utils/voteConstants";
import { ATOM_CONTRACT_ADDRESS, atomABI } from "../abi";
import { useState } from "react";
import { Network, API_URLS } from "./useAtomData";

interface UseDepositTripleProps {
  walletConnected?: any;
  walletAddress?: string;
  publicClient?: any;
  network?: Network;
}

export const useDepositTriple = ({
  walletConnected,
  walletAddress,
  publicClient,
  network = Network.MAINNET,
}: UseDepositTripleProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to fetch triple details via GraphQL
  const fetchTripleDetails = async (tripleId: bigint) => {
    try {
      const apiUrl = API_URLS[network];

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query Triple($tripleId: numeric!) {
              triple(term_id: $tripleId) {
                id
                term_id
                counter_term_id
              }
            }
          `,
          variables: { tripleId: Number(tripleId) },
        }),
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();

      if (result.errors) {
        return null;
      }

      if (!result.data?.triple) {
        return null;
      }

      // Return triple data
      return {
        id: String(tripleId),
        ...result.data.triple
      };
    } catch (error) {
      return null;
    }
  };

  // Function to deposit stake on a triple (one transaction per vote)
  const depositTriple = async (
    claimId: bigint,
    units: number,
    direction: VoteDirection
  ): Promise<DepositResponse> => {
    if (!walletConnected || !walletAddress) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    if (units <= 0) {
      return {
        success: false,
        error: "Units must be greater than 0",
      };
    }

    setIsLoading(true);

    try {
      // Get triple details
      const tripleDetails = await fetchTripleDetails(claimId);
      if (!tripleDetails) {
        setIsLoading(false);
        return {
          success: false,
          error: "Failed to fetch triple details",
        };
      }

      // Determine which ID to use based on vote direction
      let targetId: string;
      if (direction === VoteDirection.For) {
        targetId = tripleDetails.term_id || tripleDetails.id;
      } else {
        // If it's a vote against, use counter_term_id if it exists
        targetId = tripleDetails.counter_term_id || tripleDetails.id;
      }

      // Calculate value in wei
      const depositValue = UNIT_VALUE * BigInt(units);

      // Call depositTriple function directly on the main contract
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: "depositTriple",
        args: [
          walletAddress, // receiver - address that receives the shares
          BigInt(targetId) // id - triple or vault identifier
        ],
        value: depositValue,
        gas: 300000n    // Gas limit for a single transaction
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

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return {
    depositTriple,
    isLoading
  };
}; 