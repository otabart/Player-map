import React, { useEffect, useState } from "react";
import IntuitionLogo from "./assets/img/logo.svg";
import Atom from "./assets/img/atom.svg";

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
    <div className="relative flex flex-col w-full items-center py-6">
      {/* Lignes horizontales en haut et bas */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "20px",
          backgroundColor: "#FFD32A",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "20px",
          backgroundColor: "#FFD32A",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      />

      <img
        src={IntuitionLogo}
        alt="Intuition Logo"
        style={{ width: "350px", marginTop: "20px" }}
      />
      <h2
        style={{
          fontSize: "1.0em",
          margin: "0 0 20px 0",
          color: "#FFD32A",
          fontWeight: "bold",
        }}
      >
        BOSS FIGHTERS COMMUNITY PLAYER MAP
      </h2>

      <div className="flex flex-col gap-2 w-5/6 mx-auto text-base">
        <p>
          At first, there was nothing. And then, suddenly, the whole community
          appeared !
        </p>
        <p>
          Everything of which the Boss Fighters community would one day be
          composed, would be born in an instant.
        </p>
        <p>
          A single species of condensed matter, exploding in a vast universe.
        </p>
        <p>
          Although energy would neither be created nor destroyed, the
          interaction between these newly-created atoms would continue to create
          something beautiful...
        </p>
        <p>
          What had been separate would become whole again. And what would be
          created in the process would be even more beautiful than what came
          before...
        </p>
        <p>
          Our story begins with the atom. The cornerstone of our ecosystem.
        </p>
        <p>
          And our "atoms" start with you !
        </p>
      </div>

      <div className="flex flex-col gap-2 w-5/6 mx-auto text-base text-left border-2 border-yellow-400 rounded-xl p-4 my-6">
        <p>
          <span style={{ color: "#FFD32A" }}>Claims</span> in Intuition, also referred to as <span style={{ color: "#FFD32A" }}>"Triples"</span> structured in
          Semantic Triple format :
        </p>
        <p>
          [<span style={{ color: "#FFD32A" }}>Subject</span>] ⇒ [<span style={{ color: "#FFD32A" }}>Predicate</span>] ⇒ [<span style={{ color: "#FFD32A" }}>Object</span>] (For example, a triple could be :
          [SciFi] [is] [strong Boss])
        </p>
        <p>
          This keeps our attestations tidy !
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 w-5/6 mx-auto text-base">
        <p>
          You need to connect your <span style={{ color: "#FFD32A" }}>wallet (ETH - Base network)</span> and pay <span style={{ color: "#FFD32A" }}>0.0001 ETH (less than $0.40)</span> to create your player !
        </p>

        <button
        className="max-w-xs justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-12 px-4 py-2 flex items-center transition-transform duration-200 hover:scale-105 mt-4 mb-8"
        onClick={handleCreatePlayer}
      >
        <img src={Atom} alt="Atom" style={{ width: "44px", marginRight: "10px" }} />CREATE YOUR PLAYER
      </button>
      
      </div>

      
    </div>
  );
};

export default PlayerMapHome;
