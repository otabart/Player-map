import { default as React } from 'react';

interface GraphComponentProps {
    walletConnected?: boolean;
    walletAddress?: string;
    wagmiConfig?: any;
    walletHooks?: any;
    isOpen?: boolean;
    onClose?: () => void;
    onCreatePlayer?: () => void;
}
declare const GraphComponent: React.FC<GraphComponentProps>;
export default GraphComponent;
