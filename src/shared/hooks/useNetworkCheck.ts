import { useEffect, useState } from 'react';
import { ATOM_CONTRACT_CHAIN_ID } from '../../abi';

interface UseNetworkCheckProps {
  walletConnected?: any;
  publicClient?: any;
}

interface NetworkCheckResult {
  isCorrectNetwork: boolean;
  currentChainId: number | null;
  targetChainId: number;
}

interface WalletError {
  code: number;
  message: string;
}

// Configuration pour Base
const BASE_CONFIG = {
  chainId: Number(ATOM_CONTRACT_CHAIN_ID),
  chainName: 'Base',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};

export const useNetworkCheck = ({ walletConnected, publicClient }: UseNetworkCheckProps): NetworkCheckResult => {
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const targetChainId = Number(ATOM_CONTRACT_CHAIN_ID);

  useEffect(() => {
    const checkNetwork = async () => {
      if (!walletConnected || !publicClient) return;

      try {
        const chainId = await publicClient.getChainId();
        setCurrentChainId(Number(chainId));
      } catch (error) {
        console.error('Error checking network:', error);
        setCurrentChainId(null);
      }
    };

    checkNetwork();
  }, [walletConnected, publicClient]);

  const switchNetwork = async () => {
    if (!walletConnected) return;

    try {
      console.log('Attempting switchChain with chainId:', targetChainId);
      await walletConnected.switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error('Error switching network:', error);
      const walletError = error as WalletError;

      if (walletError.code === 4902) {
        try {
          console.log('Network not found, attempting to add it');
          await walletConnected.addChain(BASE_CONFIG);

          console.log('Network added, attempting switch again');
          await walletConnected.switchChain({ chainId: targetChainId });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
          throw new Error('Unable to add Base network to your wallet. Please add it manually.');
        }
      } else {
        throw new Error('Unable to switch network. Please check your wallet.');
      }
    }
  };

  return {
    isCorrectNetwork: currentChainId === targetChainId,
    currentChainId,
    targetChainId
  };
}; 