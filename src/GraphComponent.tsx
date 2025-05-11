import React, { useState } from "react";
import { Network, API_URLS } from "./hooks/useAtomData";
import { useTripleByCreator } from "./hooks/useTripleByCreator";

interface GraphComponentProps {
  walletConnected?: boolean;
  walletAddress?: string;
  wagmiConfig?: any;
  walletHooks?: any;
  isOpen?: boolean;
  onClose?: () => void;
  onCreatePlayer?: () => void;
}

const GraphComponent: React.FC<GraphComponentProps> = ({
  walletConnected = false,
  walletAddress = "",
  onCreatePlayer,
}) => {
  // État pour suivre le réseau actuel (par défaut testnet)
  const [network, setNetwork] = useState<Network>(Network.TESTNET);

  const lowerCaseAddress = walletAddress ? walletAddress.toLowerCase() : "";

  // Étape unique: Vérifier si l'utilisateur a un Player atom sur le jeu
  const {
    loading: tripleLoading,
    error: tripleError,
    triples: playerTriples,
  } = useTripleByCreator(lowerCaseAddress, 24442, 24441, network);

  // Si wallet n'est pas connecté, on affiche un message simple
  if (!walletConnected || !walletAddress) {
    return (
      <div
        className="player-map-container"
        style={{
          margin: "20px",
          padding: "30px",
          borderRadius: "8px",
          backgroundColor: "#1a1a2e",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#6c5ce7", marginBottom: "20px" }}>Player Map</h2>
        <div
          style={{
            padding: "30px",
            backgroundColor: "#151525",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Connectez votre portefeuille pour accéder à la Player Map
          </p>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c5ce7",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            disabled={true}
          >
            Connecter Wallet
          </button>
        </div>
      </div>
    );
  }

  // Déterminer le statut de l'utilisateur
  const hasPlayerAtom = playerTriples.length > 0;
  const isLoading = tripleLoading;
  const hasError = tripleError;

  // Gérer l'état de chargement
  if (isLoading) {
    return (
      <div
        className="player-map-container"
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
            textAlign: "center",
          }}
        >
          <p>Chargement des données joueur...</p>
        </div>
      </div>
    );
  }

  // Gérer les erreurs
  if (hasError) {
    return (
      <div
        className="player-map-container"
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
          <h3>Erreur lors du chargement des données</h3>
          <p>{tripleError?.message || "Erreur inconnue"}</p>
        </div>
      </div>
    );
  }

  // Interface principale basée sur l'état de l'utilisateur
  return (
    <div
      className="player-map-container"
      style={{
        margin: "20px",
        padding: "30px",
        borderRadius: "8px",
        backgroundColor: "#1a1a2e",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#6c5ce7", margin: 0 }}>Player Map</h2>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value as Network)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#151525",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "4px",
          }}
        >
          <option value={Network.MAINNET}>Mainnet</option>
          <option value={Network.TESTNET}>Testnet</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px", fontSize: "0.9em", color: "#aaa" }}>
        Wallet connecté:{" "}
        <span style={{ color: "#fff" }}>{lowerCaseAddress}</span>
      </div>

      {/* Vérification du Player */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#151525",
          borderRadius: "6px",
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            borderBottom: "1px solid #333",
            paddingBottom: "10px",
            marginTop: 0,
          }}
        >
          Vérification du Joueur
        </h3>

        {hasPlayerAtom ? (
          <div>
            <p style={{ color: "#4CAF50" }}>✓ Joueur détecté</p>
            <p>
              Triple joueur trouvé:{" "}
              <span style={{ color: "#6c5ce7" }}>{playerTriples[0]?.id}</span>
            </p>
            {playerTriples.length > 0 && (
              <div>
                <p>
                  Sujet: {playerTriples[0].subject.label} (ID:{" "}
                  {playerTriples[0].subject_id})
                </p>
                <p>
                  Prédicat: {playerTriples[0].predicate.label} (ID:{" "}
                  {playerTriples[0].predicate_id})
                </p>
                <p>
                  Objet: {playerTriples[0].object.label} (ID:{" "}
                  {playerTriples[0].object_id})
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ color: "#ff6b6b" }}>
              ✗ Aucun joueur détecté pour ce jeu
            </p>
            <button
              onClick={onCreatePlayer}
              style={{
                padding: "10px 20px",
                backgroundColor: "#FFD32A",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              CRÉER VOTRE JOUEUR
            </button>
          </div>
        )}
      </div>

      {/* Accès au Player Map */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#151525",
          borderRadius: "6px",
          opacity: hasPlayerAtom ? 1 : 0.5,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            borderBottom: "1px solid #333",
            paddingBottom: "10px",
            marginTop: 0,
          }}
        >
          Accès à la Player Map
        </h3>

        {hasPlayerAtom ? (
          <div>
            <p style={{ color: "#4CAF50", marginBottom: "20px" }}>
              ✓ Toutes les conditions sont remplies
            </p>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Voir la Player Map
            </button>
          </div>
        ) : (
          <p>Créez votre joueur pour accéder à la Player Map</p>
        )}
      </div>

      {/* Footer avec infos API */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "0.8em",
          color: "#666",
          textAlign: "center",
        }}
      >
        Utilisation de l'API {network}: {API_URLS[network]}
      </div>
    </div>
  );
};

export default GraphComponent;
