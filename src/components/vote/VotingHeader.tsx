import React from "react";

interface VotingHeaderProps {
  onClose?: () => void;
}

export const VotingHeader: React.FC<VotingHeaderProps> = ({ onClose }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        borderBottom: "1px solid #1e3b70",
      }}
    >
      <h2 style={{ fontSize: "1.3em", color: "#FFD32A", margin: 0, fontWeight: "bold" }}>
        VOTE ON CLAIMS
      </h2>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#FFF",
            cursor: "pointer",
            fontSize: "1.5em",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}; 