import React, { useState } from "react";
import {
  GraphVisualization,
  LoadingAnimation,
} from "playermap_graph";

const PlayerMapGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("baseSepolia");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Panneau principal */}
      <div style={{ flex: 1, position: "relative" }}>

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
