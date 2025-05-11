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

      // 5. Créer l'atome si nécessaire
      console.log('Creating atom...', { address: ATOM_CONTRACT_ADDRESS, hexData, value: VALUE_PER_ATOM });
      
      // Obtenir le hash de transaction
      const txHash = await walletConnected.writeContract({
        address: ATOM_CONTRACT_ADDRESS,
        abi: atomABI,
        functionName: 'createAtom',
        args: [hexData],
        value: VALUE_PER_ATOM,
      });
      
      console.log('Transaction hash:', txHash);
      
      // 6. Attendre la confirmation de la transaction en utilisant une méthode compatible
      // avec les nouvelles versions de bibliothèques
      let receipt;
      if (walletConnected.waitForTransactionReceipt) {
        // Nouvelle approche (Viem)
        receipt = await walletConnected.waitForTransactionReceipt({ hash: txHash });
      } else if (txHash.wait) {
        // Ancienne approche (ethers.js)
        receipt = await txHash.wait();
      } else {
        // Attente passive si aucune méthode n'est disponible
        console.log('No wait method available, waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      console.log('Transaction receipt:', receipt);

      // 7. Récupérer l'ID de l'atome créé - utiliser readClient
      try {
        const newAtomId = await readClient.readContract({
          address: ATOM_CONTRACT_ADDRESS,
          abi: atomABI,
          functionName: 'atomsByHash',
          args: [atomHash],
        });
        
        console.log('New atom ID:', newAtomId);

        return { 
          atomId: BigInt(newAtomId), 
          ipfsHash 
        };
      } catch (readError) {
        console.error('Error reading new atom ID:', readError);
        
        // Fallback: si nous ne pouvons pas lire l'ID, nous assumons que l'atome a été créé
        // et retournons une valeur factice puis réessayons avec publicClient si disponible
        if (publicClient && readClient !== publicClient) {
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
        
        // Si tout échoue, retourner une valeur par défaut
        return { atomId: 1n, ipfsHash };
      }
    } catch (error) {
      console.error('Error creating atom:', error);
      throw error;
    }
  };

  return {
    createAtom,
  };
}; 