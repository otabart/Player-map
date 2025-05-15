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
              triple(id: $tripleId) {
                id
                vault_id
                counter_vault_id
              }
            }
          `,
          variables: { tripleId: Number(tripleId) },
        }),
      });

      if (!response.ok) {
        console.error(`GraphQL request failed with status ${response.status}`);
        return null;
      }

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        return null;
      }

      if (!result.data?.triple) {
        console.warn(`Triple with ID ${tripleId} not found`);
        return null;
      }

      // Return triple data
      return {
        id: String(tripleId),
        ...result.data.triple
      };
    } catch (error) {
      console.error(`Error fetching details for triple ${tripleId}:`, error);
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
        targetId = tripleDetails.vault_id || tripleDetails.id;
        console.log(`Voting FOR triple ${claimId}, using vault_id: ${targetId}`);
      } else {
        // If it's a vote against, use counter_vault_id if it exists
        targetId = tripleDetails.counter_vault_id || tripleDetails.id;
        console.log(`Voting AGAINST triple ${claimId}, using counter_vault_id: ${targetId}`);
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

      console.log("Transaction sent, hash:", txHash);

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
      console.error("Error depositing stake:", error);
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