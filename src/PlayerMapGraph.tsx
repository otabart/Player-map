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
    </div>
  );
};

export default PlayerMapGraph;
