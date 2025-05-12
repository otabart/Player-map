import axios from 'axios'
import { getAuthHeader, isAuthenticated } from './auth'
import { getConfig } from './config'

interface IpfsResponse {
  ipfs_url: string
  http_url: string
}

interface IpfsHashResponse {
  ipfs_hash: string
  http_url: string
}

interface GatewayResponse {
  gateway_url: string
}

export const uploadToPinata = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated()) {
      throw new Error("Vous devez être connecté pour téléverser des fichiers")
    }
    
    // La fonction getConfig() lancera une erreur si la configuration n'est pas initialisée
    const { apiUrl } = getConfig();
    
    const url = `${apiUrl}/ipfs/upload_file`;

    const response = await axios.post<IpfsResponse>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': getAuthHeader()
        }
      }
    )

    return response.data.ipfs_url
  } catch (error) {
    // Si l'erreur vient de getConfig(), on la réexpose clairement
    if (error instanceof Error && error.message.includes('Configuration Player-map non initialisée')) {
      console.error('Erreur de configuration Player-map:', error.message);
      throw new Error("Erreur de configuration: Initialisez la bibliothèque Player-map avec PlayerMapConfig.init() avant utilisation");
    }
    
    console.error('Erreur lors du téléversement vers le serveur:', error)
    throw new Error("Échec du téléversement de l'image vers IPFS")
  }
}

export const isIpfsUrl = (url: string | undefined): boolean => {
  if (!url) return false
  return url.startsWith('ipfs://')
}

export const ipfsToHttpUrl = async (ipfsUrl: string): Promise<string> => {
  if (!isIpfsUrl(ipfsUrl)) return ipfsUrl
  
  try {
    // First check if we have a cached gateway URL
    let gatewayUrl = sessionStorage.getItem('ipfs_gateway')
    
    // If not, fetch from the API
    if (!gatewayUrl) {
      // Vérifier si l'utilisateur est authentifié
      if (!isAuthenticated()) {
        throw new Error("Vous devez être connecté pour accéder à la passerelle IPFS")
      }
      
      // La fonction getConfig() lancera une erreur si la configuration n'est pas initialisée
      const { apiUrl } = getConfig();
      
      const response = await axios.get<GatewayResponse>(
        `${apiUrl}/ipfs/gateway_url`,
        {
          headers: {
            'Authorization': getAuthHeader()
          }
        }
      )
      gatewayUrl = response.data.gateway_url
      // Cache the gateway URL for future use
      if (gatewayUrl) {
        sessionStorage.setItem('ipfs_gateway', gatewayUrl)
      } else {
        throw new Error('Aucune passerelle IPFS configurée')
      }
    }
    
  const hash = ipfsUrl.replace('ipfs://', '')
    return `https://${gatewayUrl}/ipfs/${hash}`
  } catch (error) {
    // Si l'erreur vient de getConfig(), on la réexpose clairement
    if (error instanceof Error && error.message.includes('Configuration Player-map non initialisée')) {
      console.error('Erreur de configuration Player-map:', error.message);
      throw new Error("Erreur de configuration: Initialisez la bibliothèque Player-map avec PlayerMapConfig.init() avant utilisation");
    }
    
    console.error('Erreur lors de la récupération du gateway URL:', error)
    throw error;
  }
} 