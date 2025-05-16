import { useState, useEffect } from "react";
import { VoteItem, VoteDirection } from "../types/vote";
import { PREDEFINED_CLAIM_IDS } from "../utils/voteConstants";
import { Network } from "./useAtomData";
import { useFetchTripleDetails, TripleDetails } from "./useFetchTripleDetails";
import { useDisplayTriplesWithPosition } from "./useDisplayTriplesWithPosition";

interface UseVoteItemsManagementProps {
  network?: Network;
  walletAddress?: string;
  onError?: (message: string) => void;
}

export const useVoteItemsManagement = ({
  network = Network.TESTNET,
  walletAddress = "",
  onError
}: UseVoteItemsManagementProps) => {
  const [voteItems, setVoteItems] = useState<VoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUnits, setTotalUnits] = useState(0);
  const [userPositions, setUserPositions] = useState<Record<string, VoteDirection>>({});

  // Use our hook for fetching triple details
  const { fetchTripleDetails, isLoading: isFetchingTriple } = useFetchTripleDetails({
    network,
    onError
  });

  // Fetch user's existing positions
  const { data: userPositionsData, loading: loadingPositions } = useDisplayTriplesWithPosition(walletAddress);

  // Process user positions data when it arrives
  useEffect(() => {
    if (userPositionsData && !loadingPositions && walletAddress) {
      const positions: Record<string, VoteDirection> = {};

      // Méthode 1: Vérifier si les positions sont dans le format attendu
      if (userPositionsData.positions && Array.isArray(userPositionsData.positions)) {
        userPositionsData.positions.forEach((position: any) => {
          if (!position.triple_id) return;
          const tripleId = position.triple_id;
          // Si la position a une propriété is_for ou similar pour indiquer la direction
          if (position.is_for !== undefined) {
            const direction = position.is_for ? VoteDirection.For : VoteDirection.Against;
            positions[String(tripleId)] = direction;
          } else if (position.vault_id && position.counter_vault_id) {
            // Si la position a des vault_id qui peuvent indiquer la direction
            // Logique à déterminer en fonction de la structure exacte
          }
        });
      }

      // Méthode 2: Rechercher dans le format triples avec positions imbriquées
      if (userPositionsData.triples && Array.isArray(userPositionsData.triples)) {
        console.log('PROCESSING TRIPLES:', userPositionsData.triples.length);
        userPositionsData.triples.forEach((triple: any) => {
          if (!triple.id) {
            return;
          }

          console.log('PROCESSING TRIPLE ID:', triple.id, 'Subject:', triple.subject?.label);

          // Recherche dans différentes structures possibles

          // Structure 1: Positions directement dans le triple
          if (triple.positions && Array.isArray(triple.positions)) {
            console.log('TRIPLE HAS POSITIONS ARRAY:', triple.positions.length);
            const userPosition = triple.positions.find((pos: any) =>
              pos.account?.id?.toLowerCase() === walletAddress.toLowerCase()
            );

            if (userPosition) {
              console.log('FOUND USER POSITION IN POSITIONS ARRAY FOR TRIPLE:', triple.id);
              // Déterminer la direction en fonction de la structure
              if (userPosition.is_for !== undefined) {
                positions[String(triple.id)] = userPosition.is_for ? VoteDirection.For : VoteDirection.Against;
              } else if (userPosition.vault_id && triple.vault_id === userPosition.vault_id) {
                positions[String(triple.id)] = VoteDirection.For;
              } else if (userPosition.vault_id && triple.counter_vault_id === userPosition.vault_id) {
                positions[String(triple.id)] = VoteDirection.Against;
              }
            }
          }

          // Structure 2: Positions dans les vaults
          const vaultPositions = triple.vault?.positions || [];
          const counterVaultPositions = triple.counter_vault?.positions || [];

          console.log('VAULT POSITIONS:', vaultPositions.length, 'COUNTER VAULT POSITIONS:', counterVaultPositions.length);

          // Check if user has a position in either vault
          // Remarque: la structure attendue est position.account.id et non position.account_id
          const userVaultPosition = vaultPositions.find((position: any) => {
            return position.account?.id?.toLowerCase() === walletAddress.toLowerCase();
          });

          const userCounterVaultPosition = counterVaultPositions.find((position: any) => {
            return position.account?.id?.toLowerCase() === walletAddress.toLowerCase();
          });

          if (userVaultPosition) {
            console.log('FOUND USER POSITION IN VAULT FOR TRIPLE:', triple.id);
            positions[String(triple.id)] = VoteDirection.For;
          } else if (userCounterVaultPosition) {
            console.log('FOUND USER POSITION IN COUNTER VAULT FOR TRIPLE:', triple.id);
            positions[String(triple.id)] = VoteDirection.Against;
          }
        });
      }

      // Méthode 3: Vérifier également dans des structures alternatives
      if (userPositionsData.position_triples && Array.isArray(userPositionsData.position_triples)) {
        console.log('PROCESSING POSITION_TRIPLES:', userPositionsData.position_triples.length);
        userPositionsData.position_triples.forEach((item: any) => {
          if (!item.triple_id && !item.triple?.id) return;

          const tripleId = item.triple_id || item.triple?.id;
          console.log('PROCESSING POSITION_TRIPLE ID:', tripleId);

          if (item.is_for !== undefined) {
            positions[String(tripleId)] = item.is_for ? VoteDirection.For : VoteDirection.Against;
          } else if (item.vault_id && item.triple?.vault_id === item.vault_id) {
            positions[String(tripleId)] = VoteDirection.For;
          } else if (item.vault_id && item.triple?.counter_vault_id === item.vault_id) {
            positions[String(tripleId)] = VoteDirection.Against;
          }
        });
      }

      console.log('FINAL USER POSITIONS:', positions);
      setUserPositions(positions);

      // Update existing vote items with user position information
      setVoteItems(prevItems =>
        prevItems.map(item => {
          const positionDirection = positions[String(item.id)] || VoteDirection.None;
          const hasPosition = positionDirection !== VoteDirection.None;
          console.log('VOTE ITEM UPDATE:', item.id, 'HasPosition:', hasPosition, 'Direction:', positionDirection);
          return {
            ...item,
            userHasPosition: hasPosition,
            userPositionDirection: positionDirection
          };
        })
      );
    }
  }, [userPositionsData, loadingPositions, walletAddress]);

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

        if (!details) {
          return {
            id,
            subject: `Claim ${id}`,
            predicate: "is",
            object: "Unknown",
            units: 0,
            direction: VoteDirection.None,
            userHasPosition: false,
            userPositionDirection: VoteDirection.None,
          } as VoteItem;
        }

        // Check if user has a position on this triple
        const userPositionDirection = userPositions[String(id)] || VoteDirection.None;

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
          userHasPosition: userPositionDirection !== VoteDirection.None,
          userPositionDirection,
        } as VoteItem;
      });

      const loadedItems = await Promise.all(triplesPromises);

      const allFailed = loadedItems.every(item => item.object === "Unknown");
      if (allFailed && onError) {
        onError("Error: Failed to fetch triple details. Please check your network connection or try again later.");
      }

      setVoteItems(loadedItems);
    } catch (error) {
      if (onError) {
        onError("Error: Failed to fetch triple details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to change units and direction for a claim
  const handleChangeUnits = (id: bigint, direction: VoteDirection, units: number) => {
    // Vérifier d'abord si le vote est autorisé avec la fonction isVoteDirectionAllowed
    if (direction !== VoteDirection.None) {
      const allowed = isVoteDirectionAllowed(id, direction);
      if (!allowed) {
        // Récupérer l'item pour obtenir la direction de la position existante
        const item = voteItems.find(item => item.id === id);
        if (item && item.userHasPosition && item.userPositionDirection !== VoteDirection.None) {
          if (onError) {
            onError(`Cannot vote ${direction === VoteDirection.For ? "for" : "against"} this claim as you already have an ${item.userPositionDirection === VoteDirection.For ? "affirmative" : "opposing"} position on it.`);
          }
          return; // Sortir de la fonction sans modifier l'état
        }
      }
    }

    setVoteItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // Double vérification au cas où la première aurait échoué
          if (item.userHasPosition && item.userPositionDirection !== VoteDirection.None &&
            direction !== VoteDirection.None && item.userPositionDirection !== direction) {
            // User is trying to vote in the opposite direction of their existing position
            return item; // Don't change anything
          }

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

  // Check if a vote in the given direction is allowed for the given triple ID
  const isVoteDirectionAllowed = (tripleId: bigint, direction: VoteDirection) => {
    const item = voteItems.find(item => item.id === tripleId);
    if (!item || !item.userHasPosition) return true;

    // If user has no position or wants to vote in the same direction, it's allowed
    const allowed = item.userPositionDirection === VoteDirection.None || item.userPositionDirection === direction;
    return allowed;
  };

  return {
    voteItems,
    setVoteItems,
    isLoading: isLoading || loadingPositions,
    totalUnits,
    numberOfTransactions,
    handleChangeUnits,
    resetAllVotes,
    loadTripleDetails,
    isVoteDirectionAllowed,
    userPositions
  };
}; 