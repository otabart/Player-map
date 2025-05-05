import React, { useState } from "react";
import {
  GraphVisualization,
  EndpointSelector,
  LoadingAnimation,
  ENDPOINTS,
} from "playermap_graph";

const PlayerMapGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("base");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#101020",
      }}
    >
      {/* Panneau principal */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Sélecteur d'endpoint en haut */}
        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
          <EndpointSelector
            endpoints={ENDPOINTS}
            selectedEndpoint={selectedEndpoint}
            onEndpointChange={setSelectedEndpoint}
          />
        </div>

        {/* Visualisation du graphe */}
        <GraphVisualization
          endpoint={selectedEndpoint}
          onNodeSelect={setSelectedNode}
          onLoadingChange={setIsLoading}
        />

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
      </div>
    </div>
  );
};

export default PlayerMapGraph;
