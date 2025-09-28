import React, { useState, useCallback, useEffect } from "react";
import { Network, API_URLS } from "./hooks/useAtomData";
import { useTripleByCreator } from "./hooks/useTripleByCreator";
import { fetchPositions } from "./api/fetchPositions";
import PlayerMapHome from "./PlayerMapHome";
import PlayerMapGraph from "./PlayerMapGraph";
import RegistrationForm from "./RegistrationForm";
import { PLAYER_TRIPLE_TYPES } from "./utils/constants";
import { ConnectWalletModal } from "./components/modals";
import VotingModal from "./components/vote/VotingModal";
import { PlayerMapQueryClientProvider } from "./contexts/QueryClientContext";
import { PlayerMapConfig, DefaultPlayerMapConstants } from "./types/PlayerMapConfig";
import { usePlayerConstants } from "./hooks/usePlayerConstants";
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
  config?: PlayerMapConfig; // Configuration avec constantes personnalisées
}

const GraphComponent: React.FC<GraphComponentProps> = ({
  walletConnected = false,
  walletAddress = "",
  wagmiConfig,
  walletHooks,
  onClose,
  onCreatePlayer,
  onConnectWallet,
  config, // Configuration avec constantes personnalisées
}) => {
  // Initialiser GraphQL au démarrage du composant
  useEffect(() => {
    initGraphql();
  }, []);

  // Récupérer les constantes (personnalisées ou par défaut)
  const constants: DefaultPlayerMapConstants = usePlayerConstants(config);

  // État pour suivre le réseau actuel (par défaut testnet)
  const [network, setNetwork] = useState<Network>(Network.MAINNET);
  
  // État local pour le formulaire d'inscription
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  
  // État local pour la modal de vote
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  
  // État pour la détection du wallet (plus fiable)
  const [isWalletReady, setIsWalletReady] = useState(false);
  
  // État pour les positions actives
  const [activePositions, setActivePositions] = useState<any[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);

  const lowerCaseAddress = walletAddress ? walletAddress : "";

  // Vérifier si le wallet est réellement connecté
  useEffect(() => {
    // Considérer qu'un wallet est connecté s'il y a une adresse non vide
    const hasConnectedWallet = Boolean(walletAddress && walletAddress !== "");
    setIsWalletReady(hasConnectedWallet);
  }, [walletAddress]);

  const {
    loading: tripleLoading,
    error: tripleError,
    triples: playerTriples,
  } = useTripleByCreator(lowerCaseAddress, constants.PLAYER_TRIPLE_TYPES.PLAYER_GAME.predicateId, constants.PLAYER_TRIPLE_TYPES.PLAYER_GAME.objectId, network);

  // Récupérer les positions actives quand le wallet est connecté
  useEffect(() => {
    const fetchActivePositions = async () => {
      if (!isWalletReady || !walletAddress) {
        setActivePositions([]);
        return;
      }

      setPositionsLoading(true);
      try {
        const allPositions = await fetchPositions(walletAddress, network);
        
        // Filtrer les positions pour ne garder que celles sur les triples joueur "is player of"
        // Trouver TOUS les triples avec le bon prédicat (is player of)
        const playerGameTriples = playerTriples.filter(triple => 
          triple.predicate_id === constants.PLAYER_TRIPLE_TYPES.PLAYER_GAME.predicateId
          && triple.object_id === constants.PLAYER_TRIPLE_TYPES.PLAYER_GAME.objectId
        );
        const playerTripleTermIds = playerGameTriples.map(triple => triple.term_id);
        
        const gamePositions = allPositions.filter((position: any) => {
          // Vérifier si la position est sur UN DES termes des triples joueur
          const matches = playerTripleTermIds.includes(position.term?.id);
          return matches;
        });
        
        setActivePositions(gamePositions);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setActivePositions([]);
      } finally {
        setPositionsLoading(false);
      }
    };

    fetchActivePositions();
  }, [isWalletReady, walletAddress, network, playerTriples]);

  // Vérifie si l'utilisateur a un player atom ET des positions actives
  const hasPlayerAtom = playerTriples.length > 0;
  const hasActivePositions = activePositions.length > 0;
  const hasConfirmedPlayer = hasPlayerAtom && hasActivePositions;
  const isLoading = tripleLoading || positionsLoading;
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

        {/* Affichage du PlayerMapHome, soit blurred en arrière-plan si wallet non connecté, soit normale si wallet connecté mais pas de player confirmé */}
        {(!isWalletReady || (isWalletReady && !hasConfirmedPlayer)) && (
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

        {/* Si wallet connecté et player confirmé (atom + positions actives), afficher le PlayerMapGraph */}
        {isWalletReady && hasConfirmedPlayer && (
          <PlayerMapGraph 
            walletAddress={walletAddress}
            walletConnected={walletConnected}
            walletHooks={walletHooks}
            onOpenVoting={() => setIsVotingOpen(true)}
            constants={constants} // Passer les constantes directement
            gamesId={constants.COMMON_IDS.GAMES_ID} // Passer GAMES_ID à playermap-graph
            wagmiConfig={wagmiConfig} // Passer wagmiConfig
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
          constants={constants} // Passer les constantes personnalisées !
        />

        {/* Modal de vote - seulement si wallet connecté et player confirmé */}
        {isVotingOpen && isWalletReady && hasConfirmedPlayer && (
          <VotingModal
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            publicClient={wagmiConfig?.publicClient}
            wagmiConfig={wagmiConfig}
            onClose={() => setIsVotingOpen(false)}
            constants={constants} // Passer les constantes directement
          />
        )}
        </div>
      </PlayerMapQueryClientProvider>
  );
};

export default GraphComponent;
