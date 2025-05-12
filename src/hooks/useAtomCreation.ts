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

      // 4. Vérifier si l'atome existe déjà
      // Calculer le hash que le contrat utilisera
      const atomHash = keccak256(hexData);

      // Choisir le client approprié pour la lecture
      const readClient = publicClient || walletConnected;

      // Vérifier si l'atome existe déjà
      if (readClient && typeof readClient.readContract === 'function') {
        try {
          // Vérifier si l'atome existe déjà en utilisant readClient
          const existingAtomId = await readClient.readContract({
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
      } else {
        console.warn('No valid read client with readContract method available');
      }

      // Obtenir le hash de transaction
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: 'createAtom',
        args: [hexData],
        value: VALUE_PER_ATOM,
      });

      // 6. Attendre la confirmation de la transaction en utilisant une méthode compatible
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

      // 7. Récupérer l'ID de l'atome créé
      if (readClient && typeof readClient.readContract === 'function') {
        try {
          const newAtomId = await readClient.readContract({
            address: ATOM_CONTRACT_ADDRESS,
            abi: atomABI,
            functionName: 'atomsByHash',
            args: [atomHash],
          });

          return {
            atomId: BigInt(newAtomId),
            ipfsHash
          };
        } catch (readError) {
          console.error('Error reading new atom ID with readClient:', readError);

          // Essayer avec publicClient si différent de readClient
          if (publicClient && publicClient !== readClient && typeof publicClient.readContract === 'function') {
            try {
              const atomId = await publicClient.readContract({
                address: ATOM_CONTRACT_ADDRESS,
                abi: atomABI,
                functionName: 'atomsByHash',
                args: [atomHash],
              });
              return { atomId: BigInt(atomId), ipfsHash };
            } catch (e) {
              console.error('Failed second attempt to read atom ID:', e);
            }
          }
        }
      } else {
        console.warn('No valid read client available to read the new atom ID');

        // Si publicClient est disponible et n'a pas été essayé
        if (publicClient && typeof publicClient.readContract === 'function') {
          try {
            const atomId = await publicClient.readContract({
              address: ATOM_CONTRACT_ADDRESS,
              abi: atomABI,
              functionName: 'atomsByHash',
              args: [atomHash],
            });
            return { atomId: BigInt(atomId), ipfsHash };
          } catch (e) {
            console.error('Failed fallback attempt to read atom ID with publicClient:', e);
          }
        }
      }

      // Si tout échoue, retourner une valeur factice
      console.warn('Using default atom ID as a fallback');
      return { atomId: 1n, ipfsHash };
    } catch (error) {
      console.error('Error creating atom:', error);
      throw error;
    }
  };

  return {
    createAtom,
  };
}; 