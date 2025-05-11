import { useAtomCreation } from "../hooks/useAtomCreation";
import { useBatchCreateTriple } from "../hooks/useBatchCreateTriple";

// Interface pour les données du joueur
export interface PlayerData {
  pseudo: string;
  userId: string;
  image?: string;
}

// Service pour gérer la création complète d'un joueur (atome + triples)
export const usePlayerCreationService = (
  walletConnected: any, 
  walletAddress: string,
  publicClient?: any // Ajout du publicClient
) => {
  // Hooks pour la création d'atomes et de triples
  const { createAtom } = useAtomCreation({ walletConnected, walletAddress, publicClient });
  const { createPlayerTriples } = useBatchCreateTriple({ walletConnected, walletAddress, publicClient });

  // Fonction pour créer un joueur complet
  const createPlayer = async (playerData: PlayerData): Promise<{ 
    atomId: bigint; 
    ipfsHash: string;
    tripleCreated: boolean;
    transactionHash?: string;
  }> => {
    try {
      // Étape 1: Créer l'atome du joueur
      console.log("Étape 1: Création de l'atome joueur...", playerData);
      
      const atomResult = await createAtom({
        name: playerData.pseudo,
        description: playerData.userId,
        image: playerData.image
      });

      const playerAtomId = atomResult.atomId;
      console.log(`Atome joueur créé avec succès! ID: ${playerAtomId}, Hash IPFS: ${atomResult.ipfsHash}`);

      // Pause de sécurité entre les transactions
      console.log("Pause de 2 secondes avant de créer les triples...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 2: Créer les triples pour le joueur
      console.log(`Étape 2: Création des triples pour le joueur (atomId: ${playerAtomId})...`);
      
      try {
        const tripleResult = await createPlayerTriples(playerAtomId);
        console.log("Triples créés avec succès:", tripleResult);

        return {
          atomId: playerAtomId,
          ipfsHash: atomResult.ipfsHash,
          tripleCreated: true,
          transactionHash: tripleResult.hash
        };
      } catch (tripleError) {
        console.error("Erreur lors de la création des triples:", tripleError);
        
        // Même si les triples échouent, l'atome a bien été créé
        return {
          atomId: playerAtomId,
          ipfsHash: atomResult.ipfsHash,
          tripleCreated: false,
          transactionHash: undefined
        };
      }
    } catch (error) {
      console.error("Erreur lors de la création du joueur:", error);
      throw error;
    }
  };

  return {
    createPlayer
  };
}; 