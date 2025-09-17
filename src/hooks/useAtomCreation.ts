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

      console.log('Contract address:', ATOM_CONTRACT_ADDRESS);
      console.log('VALUE_PER_ATOM:', VALUE_PER_ATOM.toString());
      console.log('Hex data:', hexData);

      // Convertir hexData en bytes correctement
      const dataBytes = hexData as `0x${string}`;

      // 4. CALCULER L'ID DE L'ATOME AVANT LA TRANSACTION
      console.log('Calculating atom ID using keccak256(encodePacked)...');
      const atomIdHex = keccak256(encodePacked(['bytes'], [dataBytes]));

      const atomId = BigInt(atomIdHex);
      console.log('Calculated atom ID:', atomId.toString());

      // 5. Créer l'atome avec createAtoms
      console.log('Creating atom with createAtoms...');
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: 'createAtoms',
        args: [
          [dataBytes], // data: bytes[] - tableau avec un seul élément bytes
          [VALUE_PER_ATOM] // assets: uint256[] - tableau avec la valeur pour un atome
        ],
        value: VALUE_PER_ATOM,
      });

      console.log('Transaction hash:', txHash);
      console.log('Atom created successfully with ID:', atomId.toString());

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
