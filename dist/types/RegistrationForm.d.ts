import { default as React } from 'react';

interface RegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
    walletConnected?: any;
    walletAddress?: string;
    wagmiConfig?: any;
    walletHooks?: {
        useAccount?: any;
        useConnect?: any;
        useWalletClient?: any;
        usePublicClient?: any;
    };
}
declare const RegistrationForm: React.FC<RegistrationFormProps>;
export default RegistrationForm;
