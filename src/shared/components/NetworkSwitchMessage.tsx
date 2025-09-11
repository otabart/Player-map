import React from "react";

interface NetworkSwitchMessageProps {
  currentChainId: number | null;
  targetChainId: number;
  allowedChainIds?: number[];
}

export const NetworkSwitchMessage = ({
  currentChainId,
  targetChainId,
  allowedChainIds = [13579]
}: NetworkSwitchMessageProps) => {
  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 13579:
        return 'Intuition Testnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#2e2e40',
      borderRadius: '8px',
      margin: '10px 0',
      textAlign: 'center'
    }}>
      <p style={{ color: '#ff4444', marginBottom: '10px' }}>
        You are not on the correct network
      </p>
      <p style={{ color: '#aaa', fontSize: '0.9em', marginBottom: '10px' }}>
        Current network: {currentChainId ? getNetworkName(currentChainId) : 'Not connected'}<br />
        Required network: {getNetworkName(13579)}
      </p>
      <p style={{ color: '#fff', fontSize: '0.9em' }}>
        Please switch to Intuition Testnet (13579) in your wallet to continue
      </p>
    </div>
  );
};
