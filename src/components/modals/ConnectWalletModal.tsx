import React from "react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onConnectWallet: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onConnectWallet,
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
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
          boxShadow: "0 0 15px rgba(108, 92, 231, 0.5)"
        }}
      >
        <h2 style={{ color: "#6c5ce7", marginBottom: "20px" }}>Wallet Required</h2>
        <p style={{ fontSize: "18px", marginBottom: "25px", color: "#fff" }}>
          Please connect your wallet to access this feature
        </p>
        <button
          onClick={onConnectWallet}
          style={{
            padding: "12px 24px",
            backgroundColor: "#6c5ce7",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}; 