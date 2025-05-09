import axios from 'axios'
import { getAuthHeader, isAuthenticated } from './auth'
import { getConfig } from './config'

interface IpfsHashResponse {
  ipfs_hash: string
  http_url: string
}

export const hashDataToIPFS = async (data: any) => {
  try {
    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated()) {
      throw new Error("Vous devez être connecté pour envoyer des données à IPFS")
    }

    // La fonction getConfig() lancera une erreur si la configuration n'est pas initialisée
    const { apiUrl } = getConfig();
    
    const url = `${apiUrl}/ipfs/hash_data`;
    console.log('Hashing data to:', url);

    const response = await axios.post<IpfsHashResponse>(
      url,
      { data },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        }
      }
    )

    return {
      ipfsHash: response.data.ipfs_hash,
      httpUrl: response.data.http_url
    }
  } catch (error) {
    // Si l'erreur vient de getConfig(), on la réexpose clairement
    if (error instanceof Error && error.message.includes('Configuration Player-map non initialisée')) {
      console.error('Erreur de configuration Player-map:', error.message);
      throw new Error("Erreur de configuration: Initialisez la bibliothèque Player-map avec PlayerMapConfig.init() avant utilisation");
    }
    
    console.error('Erreur lors du hachage de données vers IPFS:', error)
    throw error;
  }
} 