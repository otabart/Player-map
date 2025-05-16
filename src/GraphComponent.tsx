import React, { useState, useCallback, useEffect } from "react";
import { Network, API_URLS } from "./hooks/useAtomData";
import { useTripleByCreator } from "./hooks/useTripleByCreator";
import PlayerMapHome from "./PlayerMapHome";
import PlayerMapGraph from "./PlayerMapGraph";
import RegistrationForm from "./RegistrationForm";
import { PLAYER_TRIPLE_TYPES } from "./utils/constants";
import { ConnectWalletModal } from "./components/modals";

interface GraphComponentProps {
  walletConnected?: boolean;
  walletAddress?: string;
  wagmiConfig?: any;
  walletHooks?: any;
  isOpen?: boolean;
  onClose?: () => void;
  onCreatePlayer?: () => void;
  onConnectWallet?: () => void;
}

const GraphComponent: React.FC<GraphComponentProps> = ({
  walletConnected = false,
  walletAddress = "",
  wagmiConfig,
  walletHooks,
  onClose,
  onCreatePlayer,
  onConnectWallet,
}) => {
  // État pour suivre le réseau actuel (par défaut testnet)
  const [network, setNetwork] = useState<Network>(Network.TESTNET);
  
  // État local pour le formulaire d'inscription
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  
  // État pour la détection du wallet (plus fiable)
  const [isWalletReady, setIsWalletReady] = useState(false);

  const lowerCaseAddress = walletAddress ? walletAddress.toLowerCase() : "";

  // Vérifier si le wallet est réellement connecté
  useEffect(() => {
    // Considérer qu'un wallet est connecté s'il y a une adresse non vide
    const hasConnectedWallet = Boolean(walletAddress && walletAddress !== "");
    setIsWalletReady(hasConnectedWallet);
  }, [walletAddress]);

  // Étape unique: Vérifier si l'utilisateur a un Player atom sur le jeu
  const {
    loading: tripleLoading,
    error: tripleError,
    triples: playerTriples,
  } = useTripleByCreator(lowerCaseAddress, Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.predicateId), Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.objectId), network);

  // Vérifie si l'utilisateur a un player atom
  const hasPlayerAtom = playerTriples.length > 0;
  const isLoading = tripleLoading;
  const hasError = tripleError;

  // Fonction pour gérer le clic sur le bouton Create Player dans notre composant
  const handleCreatePlayer = useCallback(() => {
    
    // Si une fonction externe existe, appeler d'abord cette fonction
    if (onCreatePlayer) {
      onCreatePlayer();
    }
    
    // Dans tous les cas, ouvrir notre formulaire interne
    setIsRegistrationFormOpen(true);
  }, [onCreatePlayer]);

  // Fonction pour fermer le formulaire d'inscription
  const handleCloseRegistrationForm = useCallback(() => {
    setIsRegistrationFormOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Fonction pour gérer la connexion du wallet
  const handleConnectWallet = useCallback(() => {
    if (onConnectWallet) {
      onConnectWallet();
    }
  }, [onConnectWallet]);

  // Si en chargement, afficher un indicateur de chargement
  if (isLoading && isWalletReady) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#101020",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#6c5ce7", marginBottom: "20px" }}>Uploading datas playeur...</h2>
          <div 
            style={{ 
              width: "50px", 
              height: "50px", 
              border: "5px solid #151525", 
              borderTop: "5px solid #6c5ce7", 
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }} 
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // Si erreur, afficher le message d'erreur
  if (hasError && isWalletReady) {
    return (
      <div
        style={{
          margin: "20px",
          padding: "30px",
          borderRadius: "8px",
          backgroundColor: "#1a1a2e",
          color: "#fff",
        }}
      >
        <h2 style={{ color: "#6c5ce7", marginBottom: "20px" }}>Player Map</h2>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#151525",
            borderRadius: "6px",
            color: "#ff6b6b",
          }}
        >
          <h3>Error to uploading datas</h3>
          <p>{tripleError?.message || "Unknow error"}</p>
        </div>
      </div>
    );
  }

  // Logique principale d'affichage
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Utiliser notre nouvelle modal de connexion wallet */}
      <ConnectWalletModal
        isOpen={!isWalletReady}
        onConnectWallet={handleConnectWallet}
      />

      {/* Affichage du PlayerMapHome, soit blurred en arrière-plan si wallet non connecté, soit normale si wallet connecté mais pas de player */}
      {(!isWalletReady || (isWalletReady && !hasPlayerAtom)) && (
        <div style={{ 
          filter: !isWalletReady ? "blur(3px)" : "none", 
          opacity: !isWalletReady ? 0.7 : 1,
          position: "relative"
        }}>
          <PlayerMapHome 
            walletConnected={isWalletReady}
            walletAddress={walletAddress}
            wagmiConfig={wagmiConfig}
            walletHooks={walletHooks}
            // Passer notre propre gestionnaire de clic, pas celui externe
            onCreatePlayer={handleCreatePlayer}
          />
        </div>
      )}

      {/* Si wallet connecté et player atom trouvé, afficher le PlayerMapGraph */}
      {isWalletReady && hasPlayerAtom && (
        <PlayerMapGraph />
      )}

      {/* Formulaire d'inscription - géré directement par GraphComponent */}
      <RegistrationForm
        isOpen={isRegistrationFormOpen}
        onClose={handleCloseRegistrationForm}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        wagmiConfig={wagmiConfig}
        walletHooks={walletHooks}
      />
    </div>
  );
};

export default GraphComponent;
