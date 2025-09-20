import React, { useState, useCallback, useEffect } from "react";
import { Network, API_URLS } from "./hooks/useAtomData";
import { useTripleByCreator } from "./hooks/useTripleByCreator";
import PlayerMapHome from "./PlayerMapHome";
import PlayerMapGraph from "./PlayerMapGraph";
import RegistrationForm from "./RegistrationForm";
import { PLAYER_TRIPLE_TYPES } from "./utils/constants";
import { ConnectWalletModal } from "./components/modals";
import { PlayerMapQueryClientProvider } from "./contexts/QueryClientContext";
import initGraphql from "./config/graphql";

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
  // Initialiser GraphQL au démarrage du composant
  useEffect(() => {
    initGraphql();
  }, []);

  // État pour suivre le réseau actuel (par défaut testnet)
  const [network, setNetwork] = useState<Network>(Network.MAINNET);
  
  // État local pour le formulaire d'inscription
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  
  // État pour la détection du wallet (plus fiable)
  const [isWalletReady, setIsWalletReady] = useState(false);

  const lowerCaseAddress = walletAddress ? walletAddress : "";

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
  } = useTripleByCreator(lowerCaseAddress, PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.predicateId.toString(), PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.objectId.toString(), network);

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

  // Gestion des erreurs de chargement
  if (hasError) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100%",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2 style={{ color: "red", textAlign: "center" }}>
          Erreur lors du chargement des données
        </h2>
        <p style={{ textAlign: "center", color: "#666" }}>
          {hasError.message || "Une erreur inattendue s'est produite"}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FFD32A",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Recharger la page
        </button>
      </div>
    );
  }

  // Affichage de chargement
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100%",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "4px solid #FFD32A",
          borderTop: "4px solid transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ textAlign: "center", color: "#666" }}>
          Chargement des données du joueur...
        </p>
      </div>
    );
  }

  // Logique principale d'affichage
  return (
    <PlayerMapQueryClientProvider>
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
          <PlayerMapGraph 
            walletAddress={walletAddress}
            walletConnected={walletConnected}
            walletHooks={walletHooks}
          />
        )}

        {/* Formulaire d'inscription - géré directement par GraphComponent avec le QueryClient local */}
        <RegistrationForm
          isOpen={isRegistrationFormOpen}
          onClose={handleCloseRegistrationForm}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          wagmiConfig={wagmiConfig}
          walletHooks={walletHooks}
        />
      </div>
    </PlayerMapQueryClientProvider>
  );
};

export default GraphComponent;
