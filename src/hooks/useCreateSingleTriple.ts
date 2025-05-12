import { ATOM_CONTRACT_ADDRESS, VALUE_PER_TRIPLE, atomABI } from "../abi";

interface UseCreateSingleTripleProps {
  walletConnected?: any;
  walletAddress?: string;
  publicClient?: any;
}

export const useCreateSingleTriple = ({ walletConnected, walletAddress, publicClient }: UseCreateSingleTripleProps) => {
  // Fonction pour vérifier si un triple existe déjà
  const checkTripleExists = async (
    subjectId: bigint,
    predicateId: bigint,
    objectId: bigint
  ): Promise<boolean> => {
    if (!walletConnected || !walletAddress) {
      throw new Error("Wallet not connected");
    }

    try {
      // Choisir le client approprié pour la lecture
      const readClient = publicClient || walletConnected;
      
      // Vérifier si le triple existe déjà
      const exists = await readClient.readContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: "isTriple",
        args: [subjectId, predicateId, objectId],
      });

      return exists;
    } catch (error) {
      console.error("Error checking if triple exists:", error);
      
      // Si la première tentative échoue et que nous avons un publicClient différent, réessayer
      if (publicClient && publicClient !== walletConnected) {
        try {
          const exists = await publicClient.readContract({
            address: ATOM_CONTRACT_ADDRESS,
            abi: atomABI,
            functionName: "isTriple",
            args: [subjectId, predicateId, objectId],
          });
          return exists;
        } catch (e) {
          console.error("Second attempt failed when checking if triple exists:", e);
        }
      }
      
      return false;
    }
  };

  // Fonction pour créer un seul triple
  const createSingleTriple = async (
    subjectId: bigint,
    predicateId: bigint,
    objectId: bigint
  ): Promise<bigint> => {
    if (!walletConnected || !walletAddress) {
      throw new Error("Wallet not connected");
    }

    try {
      // Vérifier si le triple existe déjà
      const exists = await checkTripleExists(subjectId, predicateId, objectId);

      if (exists) {
        return 0n;
      }

      // Créer le triple
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: "createTriple",
        args: [subjectId, predicateId, objectId],
        value: VALUE_PER_TRIPLE,
      });
      
      // Attendre la confirmation de la transaction en utilisant une méthode compatible
      let receipt;
      if (walletConnected.waitForTransactionReceipt) {
        // Nouvelle approche (Viem)
        receipt = await walletConnected.waitForTransactionReceipt({ hash: txHash });
      } else if (txHash.wait) {
        // Ancienne approche (ethers.js)
        receipt = await txHash.wait();
      } else {
        // Attente passive si aucune méthode n'est disponible
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Retourner l'ID du triple créé (à adapter selon votre contrat)
      return 1n; // ID fictif, à adapter
    } catch (error) {
      console.error("Error creating triple:", error);
      throw error;
    }
  };

  return {
    checkTripleExists,
    createSingleTriple,
  };
}; 