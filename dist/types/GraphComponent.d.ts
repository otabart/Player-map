import { default as React } from 'react';

interface GraphComponentProps {
    walletConnected?: any;
    walletAddress?: string;
    wagmiConfig?: any;
    walletHooks?: any;
    isOpen?: boolean;
    onClose?: () => void;
}
declare const GraphComponent: React.FC<GraphComponentProps>;
export default GraphComponent;
