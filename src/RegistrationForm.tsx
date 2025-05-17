import React, { useState, useEffect, useRef } from "react";
import IntuitionLogo from "./assets/img/logo.svg";
import {
  ATOM_CONTRACT_ADDRESS,
  VALUE_PER_ATOM,
  atomABI,
  ATOM_CONTRACT_CHAIN_ID,
} from "./abi";
import { ipfsToHttpUrl, isIpfsUrl, uploadToPinata } from "./utils/pinata";
import PlayerCreationProgress from "./PlayerCreationProgress";
import { usePlayerCreationService } from "./services/playerCreationService";
import { useNetworkCheck } from "./shared/hooks/useNetworkCheck";
import { NetworkSwitchMessage } from "./shared/components/NetworkSwitchMessage";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnected?: any; // Renamed from walletClient to walletConnected
  walletAddress?: string; // Renamed from address to walletAddress
  wagmiConfig?: any; // Wagmi configuration provided by the main app
  walletHooks?: {
    useAccount?: any;
    useConnect?: any;
    useWalletClient?: any;
    usePublicClient?: any;
  };
}

// Utility function to correctly encode in bytes
function stringToHex(str: string): `0x${string}` {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const hexValue = charCode.toString(16);
    hex += hexValue.padStart(2, "0");
  }
  return `0x${hex}` as `0x${string}`;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  walletConnected,
  walletAddress,
  wagmiConfig,
  walletHooks,
}) => {
  const [formData, setFormData] = useState({
    pseudo: "",
    userId: "",
    image: "",
    guildId: "",
  });
  const [hasExistingAtom, setHasExistingAtom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [atomId, setAtomId] = useState<string | null>(null);
  const publicClient = wagmiConfig?.publicClient;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State variables for tracking creation steps
  const [step, setStep] = useState(1);
  const [isCreatingAtom, setIsCreatingAtom] = useState(false);
  const [isCreatingTriples, setIsCreatingTriples] = useState(false);
  const [tripleCreated, setTripleCreated] = useState(false);

  // Use the complete player creation service that handles both atoms and triples
  const { createPlayer } = usePlayerCreationService(
    walletConnected, 
    walletAddress || '',
    publicClient
  );

  const { isCorrectNetwork, currentChainId, targetChainId } = useNetworkCheck({
    walletConnected,
    publicClient: wagmiConfig?.publicClient
  });

  useEffect(() => {
    const checkExistingAtom = async () => {
      if (!walletAddress || !walletConnected) return;

      try {
        // Check with balanceOf
        const balance = await walletConnected.readContract({
          address: ATOM_CONTRACT_ADDRESS,
          abi: atomABI,
          functionName: "balanceOf",
          args: [walletAddress],
        });

        setHasExistingAtom(balance > 0);
      } catch (error) {
        console.error("Error checking atom balance:", error);
      }
    };

    checkExistingAtom();
  }, [walletAddress, walletConnected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    try {
      setIsUploading(true);
      const ipfsUrl = await uploadToPinata(file);
      setFormData((prev) => ({
        ...prev,
        image: ipfsUrl,
      }));
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress || !walletConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (hasExistingAtom) {
      alert("You already have an atom!");
      return;
    }

    if (!formData.pseudo || !formData.userId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setIsCreatingAtom(true);
      setStep(1);

      // Use the complete service to create a player (atom + triples)
      const result = await createPlayer({
        pseudo: formData.pseudo,
        userId: formData.userId,
        image: formData.image || undefined,
        guildId: formData.guildId ? BigInt(formData.guildId) : undefined,
      });

      setAtomId(result.atomId.toString());
      setIsCreatingAtom(false);
      
      // Update the step
      setStep(2);
      setIsCreatingTriples(true);
      
      // Wait a bit for the display of triples creation
      // (they are already being created via createPlayer)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCreatingTriples(false);
      setTripleCreated(result.tripleCreated);
      setStep(3);
      setCreationSuccess(true);
      setIsLoading(false);

      // Close the form after 3 seconds
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error creating player:", error);
      alert("Error creating player. Please try again.");
      setIsLoading(false);
      setIsCreatingAtom(false);
      setIsCreatingTriples(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#101020",
          color: "#fff",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "760px",
          width: "90%",
          position: "relative",
          border: "1px solid #FFD32A",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "10px",
            fontSize: "10px",
            color: "#666",
            textAlign: "left",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "5px",
            borderRadius: "3px",
            maxWidth: "200px",
            overflow: "hidden",
          }}
        >
          <div>
            Wallet:{" "}
            {walletAddress
              ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
              : "Not connected"}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "20px",
            color: "#666",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <img
          src={IntuitionLogo}
          alt="Intuition Logo"
          style={{ width: "100px", marginBottom: "10px" }}
        />
        <h2
          style={{
            fontSize: "1.5em",
            margin: "0 0 20px 0",
            textAlign: "center",
          }}
        >
          Create Your Player
        </h2>

        {!isCorrectNetwork ? (
          <NetworkSwitchMessage
            currentChainId={currentChainId}
            targetChainId={targetChainId}
          />
        ) : (
          <PlayerCreationProgress
            step={step}
            isCreatingAtom={isCreatingAtom}
            isCreatingTriples={isCreatingTriples}
            creationSuccess={creationSuccess}
            atomId={atomId}
            tripleCreated={tripleCreated}
            walletAddress={walletAddress}
            hasExistingAtom={hasExistingAtom}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleFileUpload={handleFileUpload}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
