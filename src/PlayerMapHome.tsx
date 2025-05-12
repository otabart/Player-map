import React, { useState } from "react";
import IntuitionLogo from "./assets/img/logo.svg";

interface PlayerMapHomeProps {
  walletConnected?: any;
  walletAddress?: string;
  wagmiConfig?: any;
  walletHooks?: any;
  onClose?: () => void;
  isOpen?: boolean;
  onCreatePlayer?: () => void;
}

const PlayerMapHome: React.FC<PlayerMapHomeProps> = ({
  walletConnected,
  walletAddress,
  wagmiConfig,
  walletHooks,
  onClose,
  isOpen: externalIsOpen,
  onCreatePlayer,
}) => {
  // Vérifier si l'utilisateur a un wallet connecté pour l'affichage conditionnel
  const isUserConnected = walletConnected && (walletAddress || (walletConnected.account && walletConnected.account.address));

  // Fonction pour gérer le clic sur le bouton de création de joueur
  const handleCreatePlayer = () => {
    if (onCreatePlayer) {
      onCreatePlayer();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#101020",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
        border: "4px solid #0078D4",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "960px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Lignes horizontales bleues en haut et bas */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "4px",
          backgroundColor: "#0078D4",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "4px",
          backgroundColor: "#0078D4",
        }}
      />

      <img
        src={IntuitionLogo}
        alt="Intuition Logo"
        style={{ width: "200px", marginBottom: "10px", marginTop: "20px" }}
      />
      <h2
        style={{
          fontSize: "1.2em",
          margin: "0 0 20px 0",
          color: "#FFD32A", // Couleur orange pour le texte BOSS FIGHTERS
        }}
      >
        BOSS FIGHTERS COMMUNITY PLAYER MAP
      </h2>

      <div style={{ maxWidth: "80%", margin: "0 auto" }}>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          At first, there was nothing. And then, suddenly, the whole community
          appeared !
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          Everything of which the Boss Fighters community would one day be
          composed, would be born in an instant.
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          A single species of condensed matter, exploding in a vast universe.
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          Although energy would neither be created nor destroyed, the
          interaction between these newly-created atoms would continue to create
          something beautiful...
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          What had been separate would become whole again. And what would be
          created in the process would be even more beautiful than what came
          before...
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          Our story begins with the atom. The cornerstone of our ecosystem.
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          And our "atoms" start with you !
        </p>
        <p style={{ fontSize: "0.9em", lineHeight: "1.5" }}>
          Every contribution will help build our ecosystem and make it
          healthy...
        </p>
      </div>

      <div
        style={{
          border: "1px solid #FFD32A",
          borderRadius: "10px",
          padding: "15px",
          margin: "20px 0",
          display: "inline-block",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          width: "80%",
          maxWidth: "700px",
        }}
      >
        <p
          style={{ fontSize: "0.9em", margin: "0 0 10px 0", textAlign: "left" }}
        >
          Claims in Intuition, also referred to as "Triples" structured in
          Semantic Triple format :
        </p>
        <p
          style={{ fontSize: "0.9em", margin: "0 0 10px 0", textAlign: "left" }}
        >
          [Subject] ⇒ [Predicate] ⇒ [Object] (For example, a triple could be :
          [SciFi] [is] [strong Boss])
        </p>
        <p style={{ fontSize: "0.9em", margin: "0", textAlign: "left" }}>
          This keeps our attestations tidy !
        </p>
      </div>

      <button
        onClick={handleCreatePlayer}
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#FFD32A",
          color: "#000",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          fontSize: "1em",
          fontWeight: "bold",
        }}
      >
        CREATE YOUR PLAYER
      </button>
    </div>
  );
};

export default PlayerMapHome;
