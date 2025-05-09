import { ATOM_CONTRACT_ADDRESS, VALUE_PER_ATOM, atomABI } from '../abi';
import { keccak256, toHex } from 'viem';
import { hashDataToIPFS } from '../utils/ipfs-utils';
import { ipfsToHttpUrl, isIpfsUrl } from '../utils/pinata';

export type IpfsAtom = {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  image?: string;
};

export type IpfsAtomInput = {
  name: string;
  description?: string;
  image?: string;
};

export interface UseAtomCreationProps {
  walletConnected?: any;
  walletAddress?: string;
}

export const useAtomCreation = ({ walletConnected, walletAddress }: UseAtomCreationProps) => {
  // Fonction pour créer un atome à partir des données utilisateur
  const createAtom = async (input: IpfsAtomInput): Promise<{ atomId: bigint; ipfsHash: string }> => {
    if (!walletConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      // 1. Formater les données selon le schéma
      const atomData: IpfsAtom = {
        '@context': 'https://schema.org/',
        '@type': 'Thing',
        ...input,
      };

      // Transformer les URL IPFS en URL HTTP pour les images
      if (atomData.image && isIpfsUrl(atomData.image)) {
        // Convertir l'URL IPFS en URL HTTP de façon asynchrone
        atomData.image = await ipfsToHttpUrl(atomData.image);
      }

      // 2. Envoyer les données à IPFS via Pinata
      const { ipfsHash } = await hashDataToIPFS(atomData);

      // 3. Convertir le hash IPFS en hex pour le contrat
      const hexData = toHex(ipfsHash);

      // 4. Vérifier si l'atome existe déjà
      // Calculer le hash que le contrat utilisera
      const atomHash = keccak256(hexData);
      
      try {
        // Vérifier si l'atome existe déjà
        const existingAtomId = await walletConnected.readContract({
          address: ATOM_CONTRACT_ADDRESS,
          abi: atomABI,
          functionName: 'atomsByHash',
          args: [atomHash],
        });

        // Si l'ID n'est pas 0, l'atome existe déjà
        if (existingAtomId && BigInt(existingAtomId) !== 0n) {
          return { 
            atomId: BigInt(existingAtomId), 
            ipfsHash 
          };
        }
      } catch (error) {
        console.error('Error checking if atom exists:', error);
        // Continuer avec la création de l'atome si la vérification échoue
      }

      // 5. Créer l'atome si nécessaire
      const tx = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: 'createAtom',
        args: [hexData],
        value: VALUE_PER_ATOM,
      });
      
      // 6. Attendre la confirmation de la transaction
      const receipt = await tx.wait();

      // 7. Récupérer l'ID de l'atome créé
      const newAtomId = await walletConnected.readContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: 'atomsByHash',
        args: [atomHash],
      });

      return { 
        atomId: BigInt(newAtomId), 
        ipfsHash 
      };
    } catch (error) {
      console.error('Error creating atom:', error);
      throw error;
    }
  };

  return {
    createAtom,
  };
}; 