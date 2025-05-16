import React from "react";

interface CreatePlayerModalProps {
  isOpen: boolean;
  onCreatePlayer: () => void;
  onClose?: () => void;
}

export const CreatePlayerModal: React.FC<CreatePlayerModalProps> = ({
  isOpen,
  onCreatePlayer,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 1)",
        backdropFilter: "blur(1px)",
        zIndex: 1000,
        width: "100%",
        height: "100%"
      }}
    >
      <div 
        style={{
          backgroundColor: "#1a1a2e",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          maxWidth: "500px",
          boxShadow: "0 0 15px rgba(0, 128, 255, 0.7)",
          position: "relative"
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "20px",
              color: "#666",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
        <h2 style={{ color: "#FFD32A", marginBottom: "20px" }}>Player Required</h2>
        <p style={{ fontSize: "18px", marginBottom: "25px", color: "#fff" }}>
          You need to create a player before you can vote on claims
        </p>
        <button
          onClick={onCreatePlayer}
          style={{
            padding: "12px 24px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Create Player
        </button>
      </div>
    </div>
  );
}; 