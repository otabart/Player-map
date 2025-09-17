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
  allowedChainIds: number[];
}

interface WalletError {
  code: number;
  message: string;
}

// Configuration pour Intuition Testnet
const INTUITION_TESTNET_CONFIG = {
  chainId: 13579, // Chain ID d'Intuition testnet
  chainName: 'Intuition Testnet',
  nativeCurrency: {
    name: 'tTRUST',
    symbol: 'tTRUST',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.rpc.intuition.systems'],
  blockExplorerUrls: ['https://intuition-testnet.explorer.caldera.xyz'],
};

export const useNetworkCheck = ({ walletConnected, publicClient }: UseNetworkCheckProps): NetworkCheckResult => {
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const allowedChainIds = [13579]; // Intuition Testnet uniquement
  const targetChainId = Number(ATOM_CONTRACT_CHAIN_ID); // 13579 pour Intuition testnet

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
          await walletConnected.addChain(INTUITION_TESTNET_CONFIG);

          console.log('Network added, attempting switch again');
          await walletConnected.switchChain({ chainId: targetChainId });
        } catch (addError) {
          console.error('Error adding Intuition network:', addError);
          throw new Error('Unable to add Intuition network to your wallet. Please add it manually.');
        }
      } else {
        throw new Error('Unable to switch network. Please check your wallet.');
      }
    }
  };

  return {
    isCorrectNetwork: currentChainId !== null && allowedChainIds.includes(currentChainId),
    currentChainId,
    targetChainId,
    allowedChainIds
  };
};
