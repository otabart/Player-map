import { default as React } from 'react';

interface PlayerMapHomeProps {
    walletConnected?: any;
    walletAddress?: string;
    wagmiConfig?: any;
    walletHooks?: any;
    onClose?: () => void;
    isOpen?: boolean;
    onCreatePlayer?: () => void;
}
declare const PlayerMapHome: React.FC<PlayerMapHomeProps>;
export default PlayerMapHome;
