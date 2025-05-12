import { useAtomCreation } from "../hooks/useAtomCreation";
import { useBatchCreateTriple, TripleToCreate } from "../hooks/useBatchCreateTriple";
import { PLAYER_TRIPLE_TYPES } from "../utils/constants";

// Interface pour les données du joueur
export interface PlayerData {
  pseudo: string;
  userId: string;
  image?: string | undefined;
  guildId?: bigint; // Ajout du guildId facultatif
}

// Service pour gérer la création complète d'un joueur (atome + triples)
export const usePlayerCreationService = (
  walletConnected: any,
  walletAddress: string,
  publicClient?: any // Ajout du publicClient
) => {
  // Hooks pour la création d'atomes et de triples
  const { createAtom } = useAtomCreation({ walletConnected, walletAddress, publicClient });
  const { batchCreateTriple } = useBatchCreateTriple({ walletConnected, walletAddress, publicClient });

  // Fonction pour créer un joueur complet
  const createPlayer = async (playerData: PlayerData): Promise<{
    atomId: bigint;
    ipfsHash: string;
    tripleCreated: boolean;
    transactionHash?: string;
  }> => {
    try {
      // Étape 1: Créer l'atome du joueur
      const atomResult = await createAtom({
        name: playerData.pseudo,
        description: playerData.userId,
        image: playerData.image
      });

      const playerAtomId = atomResult.atomId;

      // Pause de sécurité entre les transactions
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 2: Créer les triples pour le joueur
      try {
        // Préparation des triples standard
        const triplesToCreate: TripleToCreate[] = [
          {
            subjectId: playerAtomId,
            predicateId: PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.predicateId,
            objectId: PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.objectId,
          },
          {
            subjectId: playerAtomId,
            predicateId: PLAYER_TRIPLE_TYPES.IS_FAIRPLAY.predicateId,
            objectId: PLAYER_TRIPLE_TYPES.IS_FAIRPLAY.objectId,
          },
          {
            subjectId: playerAtomId,
            predicateId: PLAYER_TRIPLE_TYPES.IS_STRONG_BOSS.predicateId,
            objectId: PLAYER_TRIPLE_TYPES.IS_STRONG_BOSS.objectId,
          },
          {
            subjectId: playerAtomId,
            predicateId: PLAYER_TRIPLE_TYPES.IS_STRONG_FIGHTER.predicateId,
            objectId: PLAYER_TRIPLE_TYPES.IS_STRONG_FIGHTER.objectId,
          }
        ];

        // Ajouter le triple de guilde si une guilde est spécifiée
        if (playerData.guildId) {
          triplesToCreate.push({
            subjectId: playerAtomId,
            predicateId: PLAYER_TRIPLE_TYPES.IS_PLAYER_GUILD.predicateId,
            objectId: playerData.guildId
          });
        }

        // Création en batch de tous les triples
        const tripleResult = await batchCreateTriple(triplesToCreate);

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