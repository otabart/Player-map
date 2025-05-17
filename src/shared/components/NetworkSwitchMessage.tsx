import React from 'react';

interface NetworkSwitchMessageProps {
  currentChainId: number | null;
  targetChainId: number;
}

export const NetworkSwitchMessage: React.FC<NetworkSwitchMessageProps> = ({
  currentChainId,
  targetChainId
}) => {
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
        Current network: {currentChainId || 'Not connected'}<br />
        Required network: Base (Chain ID: {targetChainId})
      </p>
      <p style={{ color: '#fff', fontSize: '0.9em' }}>
        Please switch to Base network in your wallet to continue
      </p>
    </div>
  );
}; 