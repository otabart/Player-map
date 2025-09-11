import React, { useState } from 'react';
import { ClaimItem } from '../components/vote/ClaimItem';
import { VoteDirection, VoteItem } from '../types/vote';
import { Network } from '../hooks/useAtomData';
import { useCheckSpecificTriplePosition } from '../hooks/useCheckSpecificTriplePosition';

// This is a test page to check the direct position lookup
const DirectPositionCheck: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [tripleId, setTripleId] = useState<string>('24596'); // Default to the triple ID seen in the UI
  const [network, setNetwork] = useState<Network>(Network.MAINNET);

  // For debugging purposes
  const { 
    hasPosition, 
    isFor, 
    loading, 
    error 
  } = useCheckSpecificTriplePosition({
    walletAddress,
    tripleId,
    network
  });

  // Create a test vote item
  const testVoteItem: VoteItem = {
    id: BigInt(tripleId),
    subject: 'thibroux',
    predicate: 'is player of',
    object: 'The Alchemists',
    units: 0,
    direction: VoteDirection.None,
    term_position_count: 2,
    counter_term_position_count: 2,
    userHasPosition: false,
    userPositionDirection: VoteDirection.None
  };

  // Dummy handler for ClaimItem
  const handleChangeUnits = (id: bigint, direction: VoteDirection, units: number) => {
    console.log('Changed units:', { id: id.toString(), direction, units });
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#0d1117',
      color: '#f0f6fc',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Direct Position Check Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Wallet Address:
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#f0f6fc'
            }}
            placeholder="Enter wallet address (0x...)"
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Triple ID:
          </label>
          <input
            type="text"
            value={tripleId}
            onChange={(e) => setTripleId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#f0f6fc'
            }}
            placeholder="Enter triple ID"
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Network:
          </label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as Network)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#f0f6fc'
            }}
          >
            <option value={Network.TESTNET}>Testnet</option>
            <option value={Network.MAINNET}>Mainnet</option>
          </select>
        </div>
      </div>

      {/* Direct position check results */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#161b22',
        borderRadius: '6px',
        border: '1px solid #30363d'
      }}>
        <h2 style={{ marginBottom: '10px', fontSize: '18px' }}>Direct Position Check Results:</h2>
        {loading ? (
          <p>Loading position data...</p>
        ) : error ? (
          <p style={{ color: '#f85149' }}>Error: {error.message}</p>
        ) : (
          <div>
            <p>Has position: <strong>{hasPosition ? 'YES' : 'NO'}</strong></p>
            {hasPosition && (
              <p>Position direction: <strong>{isFor ? 'FOR' : 'AGAINST'}</strong></p>
            )}
          </div>
        )}
      </div>

      {/* ClaimItem with direct position checking */}
      <h2 style={{ marginBottom: '15px', fontSize: '18px' }}>Claim Item with Direct Position Check:</h2>
      <ClaimItem
        voteItem={testVoteItem}
        onChangeUnits={handleChangeUnits}
        walletAddress={walletAddress}
        network={network}
      />
    </div>
  );
};

export default DirectPositionCheck; 