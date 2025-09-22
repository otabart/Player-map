import React, { useState } from "react";
import {
  GraphVisualization,
  LoadingAnimation,
} from "playermap_graph";
import { SidebarDrawer, AtomDetailsSection, ClaimsSection, PositionsSection, ActivitySection } from "./components/graph";
import { FaUser, FaVoteYea } from "react-icons/fa";
import { useSidebarData } from "./hooks/useSidebarData";
import { Network } from "./hooks/useAtomData";
import { DefaultPlayerMapConstants } from "./types/PlayerMapConfig";

interface PlayerMapGraphProps {
  walletAddress?: string;
  walletConnected?: any;
  walletHooks?: any;
  onOpenVoting?: () => void; // Callback pour ouvrir la modal depuis GraphComponent
  constants: DefaultPlayerMapConstants; // Constantes injectées directement
}

// Définir les types pour les props des composants
interface GraphVisualizationProps {
  endpoint: string;
  onNodeSelect: (node: any) => void;
  onLoadingChange: (isLoading: boolean) => void;
  walletAddress?: string;
}

interface LoadingAnimationProps {}

const PlayerMapGraph: React.FC<PlayerMapGraphProps> = ({ walletAddress, walletConnected, walletHooks, onOpenVoting, constants }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("base"); // TODO: change to mainnet
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hovered, setHovered] = useState("");
  
  // Handler pour le vote avec fallback sécurisé
  const handleVoteClick = () => {
    if (onOpenVoting) {
      onOpenVoting();
    } else {
      console.warn('onOpenVoting not provided to PlayerMapGraph');
    }
  };

  // Charger les données de la sidebar
  const { atomDetails, triples, positions, activities, connections, loading: sidebarLoading, error: sidebarError } = useSidebarData(walletAddress, Network.MAINNET, constants);

  // Styles identiques à NavigationBar.jsx
  const navBtnStyle = {
    background: "#ffd32a",
    color: "#18181b",
    border: "none",
    borderRadius: 12,
    width: 44,
    height: 44,
    fontSize: 22,
    fontWeight: "bold" as const,
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    cursor: "pointer",
    marginBottom: 0,
    marginTop: 0,
    textTransform: "uppercase" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 0,
    transition: "background 0.2s, color 0.2s, transform 0.1s",
  };

  const navBtnHoverStyle = {
    background: "#ffe066",
    color: "#18181b",
    transform: "translateY(-2px) scale(1.03)",
  };

  const getBtnStyle = (key: string) =>
    hovered === key ? { ...navBtnStyle, ...navBtnHoverStyle } : navBtnStyle;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Visualisation du graphe */}
      <div 
        style={{ 
          position: "relative",
          flex: 1,
          width: "100%", 
          height: "100%",
          overflow: "hidden"
        }}
      >
        <GraphVisualization
          endpoint={selectedEndpoint}
          onNodeSelect={setSelectedNode}
          onLoadingChange={setIsLoading}
          walletAddress={walletAddress}
        />
      </div>

      {/* Animation de chargement */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <LoadingAnimation />
        </div>
      )}

      {/* Bouton "My View" en haut à gauche */}
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "18px",
          zIndex: 50,
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <button
          style={getBtnStyle("profile")}
          onClick={() => setSidebarOpen(true)}
          aria-label="Profile"
          onMouseEnter={() => setHovered("profile")}
          onMouseLeave={() => setHovered("")}
        >
          <FaUser />
        </button>
      </div>

      {/* Bouton "Vote" en bas à gauche */}
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          left: "18px",
          zIndex: 50,
        }}
      >
        <button
          style={{
            ...getBtnStyle("vote"),
            fontSize: "18px",
            fontWeight: "bolder",
            width: "auto",
            minWidth: "160px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onClick={handleVoteClick}
          aria-label="Vote"
          onMouseEnter={() => setHovered("vote")}
          onMouseLeave={() => setHovered("")}
        >
          GIVE A FEEDBACK <FaVoteYea />
        </button>
      </div>

      {/* Overlay pour le clic en dehors de la sidebar */}
      {sidebarOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            zIndex: 1200,
            pointerEvents: "auto",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SidebarDrawer migré de playermap-graph */}
      <SidebarDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >        
        {sidebarLoading && (
          <p>Loading data...</p>
        )}
        
        {sidebarError && (
          <p style={{ color: 'red' }}>Error : {sidebarError}</p>
        )}
        
        {!sidebarLoading && !sidebarError && (
          <>            
            <AtomDetailsSection 
              atomDetails={atomDetails}
              connections={connections}
              walletAddress={walletAddress}
            />
            
            <ClaimsSection activities={activities} />
            
            <PositionsSection 
              accountId={walletAddress || ""} 
              walletConnected={walletConnected}
              walletAddress={walletAddress}
            />
            
            <ActivitySection accountId={walletAddress || ""} />
          </>
        )}
      </SidebarDrawer>

    </div>
  );
};

export default PlayerMapGraph;
