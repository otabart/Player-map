import React, { useState } from "react";
import {
  GraphVisualization,
  LoadingAnimation,
} from "playermap_graph";
import { SidebarDrawer, ActivityCard } from "./components/graph";
import { FaUser } from "react-icons/fa";
import { useSidebarData } from "./hooks/useSidebarData";
import { Network } from "./hooks/useAtomData";

interface PlayerMapGraphProps {
  walletAddress?: string;
}

// Définir les types pour les props des composants
interface GraphVisualizationProps {
  endpoint: string;
  onNodeSelect: (node: any) => void;
  onLoadingChange: (isLoading: boolean) => void;
  walletAddress?: string;
}

interface LoadingAnimationProps {}

const PlayerMapGraph: React.FC<PlayerMapGraphProps> = ({ walletAddress }) => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("base"); // TODO: change to mainnet
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hovered, setHovered] = useState("");

  // Charger les données de la sidebar
  const { atomDetails, triples, positions, activities, connections, loading: sidebarLoading, error: sidebarError } = useSidebarData(walletAddress, Network.MAINNET);

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

      {/* Bouton "My View" identique à NavigationBar.jsx */}
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
            {atomDetails && (
              <>
                <p><strong>{atomDetails.label || "Not defined"}</strong></p>
                
                {/* Section Connections - Données réelles */}
                <div style={{ marginBottom: '10px' }}>
                  <p>Following: {connections.followers.length} - Followers: {connections.follows.length}</p>
                </div>
                
                <p><strong>ID :</strong> {atomDetails.description || "query a travailler"}</p>
                <p><strong>Wallet :</strong> {walletAddress || "Not connected"}</p>
              </>
            )}
            
            {/* Section Claims - Données réelles */}
            <div style={{ marginTop: '20px' }}>
              <h3>My Claims ({activities.length})</h3>
              {activities.length > 0 ? (
                <ul style={{ fontSize: '14px', maxHeight: '200px', overflowY: 'auto' }}>
                  {activities.slice(0, 5).map((claim, index) => (
                    <li key={claim.term_id} style={{ marginBottom: '8px' }}>
                      {claim.predicate.label} → {claim.object.label}
                    </li>
                  ))}
                  {activities.length > 5 && <li>... and {activities.length - 5} others</li>}
                </ul>
              ) : (
                <p>No claim found</p>
              )}
            </div>
            
            {/* Section Activity - Données réelles avec ActivityCard */}
            <div style={{ marginTop: '20px' }}>
              <h3>My Activity ({positions.length})</h3>
              {positions.length > 0 ? (
                <div style={{ fontSize: '14px', maxHeight: '200px', overflowY: 'auto' }}>
                  {positions.slice(0, 5).map((position, index) => (
                    <ActivityCard key={position.id || index} position={position} />
                  ))}
                  {positions.length > 5 && (
                    <p style={{ color: "#fff", fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
                      ... and {positions.length - 5} other activities
                    </p>
                  )}
                </div>
              ) : (
                <p>No activity found</p>
              )}
            </div>
          </>
        )}
      </SidebarDrawer>
    </div>
  );
};

export default PlayerMapGraph;
