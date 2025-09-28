import { getPinataConstants } from './globalConstants'
import { uploadToPinata } from './pinata'

export const hashDataToIPFS = async (data: any) => {
  try {
    // Récupérer les constantes Pinata
    const constants = getPinataConstants();
    if (!constants?.PINATA_CONFIG?.JWT_KEY || !constants?.PINATA_CONFIG?.IPFS_GATEWAY) {
      throw new Error("Configuration Pinata manquante. Appelez setPinataConstants() avec PINATA_CONFIG");
    }

    // Créer un fichier JSON à partir des données
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const jsonFile = new File([jsonBlob], 'data.json', { type: 'application/json' });

    // Uploader le JSON vers Pinata
    const ipfsUrl = await uploadToPinata(jsonFile);
    const hash = ipfsUrl.replace('ipfs://', '');
    const PINATA_GATEWAY = constants.PINATA_CONFIG.IPFS_GATEWAY;

    return {
      ipfsHash: `ipfs://${hash}`, // ← AJOUTER LE PRÉFIXE ipfs://
      httpUrl: `https://${PINATA_GATEWAY}/ipfs/${hash}`
    }
  } catch (error) {
    console.error('Erreur lors du hachage de données vers IPFS:', error)
    throw error;
  }
} 