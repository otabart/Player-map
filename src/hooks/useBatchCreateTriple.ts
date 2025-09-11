import { ATOM_CONTRACT_ADDRESS, VALUE_PER_TRIPLE, atomABI } from "../abi";
import { PLAYER_TRIPLE_TYPES } from "../utils/constants";

// Structure pour les triples à créer
export interface TripleToCreate {
  subjectId: bigint;
  predicateId: bigint;
  objectId: bigint;
}

interface UseBatchCreateTripleProps {
  walletConnected?: any;
  walletAddress?: string;
  publicClient?: any;
}

export const useBatchCreateTriple = ({ walletConnected, walletAddress, publicClient }: UseBatchCreateTripleProps) => {
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

      // Vérifier que le client a bien la méthode readContract
      if (!readClient || typeof readClient.readContract !== 'function') {
        console.warn('No valid read client available to check if triple exists');
        return false;
      }

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
      if (publicClient && publicClient !== walletConnected && typeof publicClient.readContract === 'function') {
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

  // Fonction pour créer plusieurs triples en une seule transaction
  const batchCreateTriple = async (triples: TripleToCreate[]): Promise<any> => {
    if (!walletConnected || !walletAddress) {
      throw new Error("Wallet not connected");
    }

    try {
      // Préparation des arrays pour la fonction createTriples (v2)
      const subjectIds = triples.map((t) => `0x${t.subjectId.toString(16).padStart(64, '0')}` as `0x${string}`);
      const predicateIds = triples.map((t) => `0x${t.predicateId.toString(16).padStart(64, '0')}` as `0x${string}`);
      const objectIds = triples.map((t) => `0x${t.objectId.toString(16).padStart(64, '0')}` as `0x${string}`);
      const assets = triples.map(() => VALUE_PER_TRIPLE); // Ajouté le paramètre assets

      // Appel au contrat
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: "createTriples", // Changé de "batchCreateTriple" à "createTriples"
        args: [subjectIds, predicateIds, objectIds, assets], // Ajouté le paramètre assets
        value: VALUE_PER_TRIPLE * BigInt(triples.length), // Valeur pour chaque triple
      });

      // Attendre la confirmation en utilisant une méthode compatible
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

      return {
        hash: typeof txHash === 'string' ? txHash : txHash.hash,
        receipt
      };
    } catch (error) {
      console.error("Error batch creating triples:", error);
      throw error;
    }
  };

  // Fonction spécifique pour créer les triples de joueur
  const createPlayerTriples = async (playerAtomId: bigint): Promise<any> => {

    // Création des triples spécifiques pour le joueur
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

    return batchCreateTriple(triplesToCreate);
  };

  return {
    checkTripleExists,
    batchCreateTriple,
    createPlayerTriples,
  };
}; 