import { default as React } from 'react';

interface PlayerCreationFormProps {
    isOpen: boolean;
    onClose: () => void;
    walletConnected?: any;
    walletAddress?: string;
    wagmiConfig?: any;
    publicClient?: any;
    walletHooks?: {
        useAccount?: any;
        useConnect?: any;
        useWalletClient?: any;
        usePublicClient?: any;
    };
}
declare const PlayerCreationForm: React.FC<PlayerCreationFormProps>;
export default PlayerCreationForm;
