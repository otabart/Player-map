import { default as React } from 'react';

interface PlayerCreationProgressProps {
    step: number;
    isCreatingAtom: boolean;
    isCreatingTriples: boolean;
    creationSuccess: boolean;
    atomId: string | null;
    tripleCreated: boolean;
    walletAddress?: string;
    hasExistingAtom: boolean;
    formData: {
        pseudo: string;
        userId: string;
        image: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    isLoading: boolean;
    isUploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
}
declare const PlayerCreationProgress: React.FC<PlayerCreationProgressProps>;
export default PlayerCreationProgress;
