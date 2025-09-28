import { ATOM_CONTRACT_ADDRESS, VALUE_PER_ATOM, atomABI } from '../abi';
import { keccak256, toHex, encodePacked } from 'viem';
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
  image?: string | undefined;
};

export interface UseAtomCreationProps {
  walletConnected?: any;
  walletAddress?: string;
  publicClient?: any;
}

export const useAtomCreation = ({ walletConnected, walletAddress, publicClient }: UseAtomCreationProps) => {
  // Fonction pour créer un atome à partir des données utilisateur
  const createAtom = async (input: IpfsAtomInput): Promise<{ atomId: bigint; ipfsHash: string }> => {
    if (!walletConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      // 1. Formater les données selon le schéma (comme dans buildproof)
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

      // 2. Convertir les données JSON en bytes pour le contrat (comme le backend original)
      const jsonString = JSON.stringify(atomData);
      const dataBytes = toHex(jsonString);

      // 3. Upload vers IPFS pour référence (optionnel)
      const { ipfsHash } = await hashDataToIPFS(atomData);

      // 4. CALCULER L'ID DE L'ATOME AVANT LA TRANSACTION
      const atomIdHex = keccak256(encodePacked(['bytes'], [dataBytes]));

      const atomId = BigInt(atomIdHex);

      // 5. Créer l'atome avec createAtoms
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: 'createAtoms',
        args: [
          [dataBytes],
          [VALUE_PER_ATOM]
        ],
        value: VALUE_PER_ATOM,
      });

      return {
        atomId,
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
