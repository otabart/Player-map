import React, { useEffect } from 'react';
import { ClaimVoting } from './ClaimVoting';
import { DefaultPlayerMapConstants } from '../../types/PlayerMapConfig';

interface VotingModalProps {
  walletConnected: any;
  walletAddress?: string;
  publicClient?: any;
  onClose: () => void;
  constants: DefaultPlayerMapConstants; // Constantes injectées directement
  wagmiConfig?: any;
}

/**
 * Modal component for the voting system using ClaimVoting
 */
const VotingModal: React.FC<VotingModalProps> = ({ 
  walletConnected, 
  walletAddress, 
  publicClient, 
  onClose,
  constants,
  wagmiConfig
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center height-700px"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
      }}
    >
      <div 
        style={{ 
          backgroundColor: '#18181b',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '700px',
          height: '700px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          padding: '0'
        }}>
          <ClaimVoting
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            publicClient={publicClient}
            onClose={onClose}
            network="mainnet"
            wagmiConfig={wagmiConfig}
            constants={constants}
          />
        </div>
      </div>
    </div>
  );
};

export default VotingModal;
