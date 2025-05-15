import { useState, useEffect } from "react";
import { VoteItem, VoteDirection } from "../types/vote";
import { PREDEFINED_CLAIM_IDS } from "../utils/voteConstants";
import { Network } from "./useAtomData";
import { useFetchTripleDetails, TripleDetails } from "./useFetchTripleDetails";

interface UseVoteItemsManagementProps {
  network?: Network;
  onError?: (message: string) => void;
}

export const useVoteItemsManagement = ({
  network = Network.TESTNET,
  onError
}: UseVoteItemsManagementProps) => {
  const [voteItems, setVoteItems] = useState<VoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUnits, setTotalUnits] = useState(0);

  // Use our hook for fetching triple details
  const { fetchTripleDetails, isLoading: isFetchingTriple } = useFetchTripleDetails({
    network,
    onError
  });

  // Load triple details when hook is initialized
  useEffect(() => {
    loadTripleDetails();
  }, []);

  // Update total units when voteItems change
  useEffect(() => {
    const total = voteItems.reduce((sum, item) => sum + item.units, 0);
    setTotalUnits(total);
  }, [voteItems]);

  // Function to load triple details from the blockchain
  const loadTripleDetails = async () => {
    setIsLoading(true);

    try {
      const triplesPromises = PREDEFINED_CLAIM_IDS.map(async (id) => {
        const details = await fetchTripleDetails(id);
        console.log(`Received details for triple ${id}:`, details);

        if (!details) {
          return {
            id,
            subject: `Claim ${id}`,
            predicate: "is",
            object: "Unknown",
            units: 0,
            direction: VoteDirection.None,
          } as VoteItem;
        }

        return {
          id: BigInt(details.id),
          subject: details.subject?.label || `Subject ${id}`,
          predicate: details.predicate?.label || "is",
          object: details.object?.label || `Object ${id}`,
          units: 0,
          direction: VoteDirection.None,
          vault_id: details.vault_id,
          vault_position_count: details.vault_position_count || 0,
          counter_vault_id: details.counter_vault_id,
          counter_vault_position_count: details.counter_vault_position_count || 0,
        } as VoteItem;
      });

      const loadedItems = await Promise.all(triplesPromises);
      console.log("Loaded vote items:", loadedItems);

      const allFailed = loadedItems.every(item => item.object === "Unknown");
      if (allFailed && onError) {
        onError("Error: Failed to fetch triple details. Please check your network connection or try again later.");
      }

      setVoteItems(loadedItems);
    } catch (error) {
      console.error("Error loading triple details:", error);
      if (onError) {
        onError("Error: Failed to fetch triple details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to change units and direction for a claim
  const handleChangeUnits = (id: bigint, direction: VoteDirection, units: number) => {
    setVoteItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (item.direction !== direction && item.direction !== VoteDirection.None) {
            return { ...item, units, direction };
          }

          if (units === 0) {
            return { ...item, units: 0, direction: VoteDirection.None };
          }

          return { ...item, units, direction };
        }
        return item;
      })
    );
  };

  // Function to reset all votes
  const resetAllVotes = () => {
    setVoteItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        units: 0,
        direction: VoteDirection.None,
      }))
    );
  };

  // Calculate number of transactions that will be executed
  const numberOfTransactions = voteItems.filter(item => item.units > 0).length;

  return {
    voteItems,
    setVoteItems,
    isLoading,
    totalUnits,
    numberOfTransactions,
    handleChangeUnits,
    resetAllVotes,
    loadTripleDetails
  };
}; 