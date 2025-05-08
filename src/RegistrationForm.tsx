import React, { useState, useEffect, useRef } from "react";
import IntuitionLogo from "./assets/img/logo.svg";
import {
  ATOM_CONTRACT_ADDRESS,
  VALUE_PER_ATOM,
  atomABI,
  ATOM_CONTRACT_CHAIN_ID,
} from "./abi";
import { useAtomCreation } from "./hooks/useAtomCreation";
import { ipfsToHttpUrl, isIpfsUrl, uploadToPinata } from "./utils/pinata";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnected?: any; // Renommé de walletClient à walletConnected
  walletAddress?: string; // Renommé de address à walletAddress
  wagmiConfig?: any; // Configuration Wagmi fournie par l'app principale
  walletHooks?: {
    useAccount?: any;
    useConnect?: any;
    useWalletClient?: any;
    usePublicClient?: any;
  };
}

// Fonction utilitaire pour encoder correctement en bytes
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
  });
  const [hasExistingAtom, setHasExistingAtom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [atomId, setAtomId] = useState<string | null>(null);
  const publicClient = wagmiConfig?.publicClient;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utiliser notre hook de création d'atomes
  const { createAtom } = useAtomCreation({ walletConnected, walletAddress });

  useEffect(() => {
    const checkExistingAtom = async () => {
      if (!walletAddress || !walletConnected) return;

      try {
        // Vérifier avec balanceOf
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
      console.error("Erreur lors du téléversement de l'image:", error);
      alert("Erreur lors du téléversement de l'image. Veuillez réessayer.");
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

      // Utiliser notre hook pour créer l'atome
      const result = await createAtom({
        name: formData.pseudo,
        description: formData.userId,
        image: formData.image || undefined,
      });

      setAtomId(result.atomId.toString());
      setCreationSuccess(true);
      setIsLoading(false);

      // Fermer le formulaire après 3 secondes
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error creating atom:", error);
      alert("Error creating atom. Please try again.");
      setIsLoading(false);
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
          <div>Connected: {String(!!walletConnected)}</div>
          <div>Has Atom: {String(hasExistingAtom)}</div>
        </div>

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={IntuitionLogo}
            alt="Intuition Logo"
            style={{ width: "120px", marginBottom: "10px" }}
          />
          <h3 style={{ color: "#FFD32A", fontSize: "1em", margin: "10px 0" }}>
            CREATE YOUR ATOM
          </h3>
          <p style={{ fontSize: "0.8em", color: "#aaa" }}>
            Réseau: Base Sepolia (Chain ID: {ATOM_CONTRACT_CHAIN_ID})
          </p>
        </div>

        {creationSuccess ? (
          <div style={{ textAlign: "center", color: "#4CAF50" }}>
            <h3 style={{ color: "#4CAF50", marginBottom: "10px" }}>Success!</h3>
            <p>Your atom has been created successfully.</p>
            <p>Atom ID: {atomId}</p>
            <p>This window will close automatically...</p>
          </div>
        ) : !walletAddress ? (
          <div>
            <p style={{ textAlign: "center", color: "#ff4444" }}>
              Please connect your wallet first
            </p>
          </div>
        ) : hasExistingAtom ? (
          <p style={{ textAlign: "center", color: "#ff4444" }}>
            You already have an atom associated with this wallet
          </p>
        ) : (
          <>
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                  textAlign: "left",
                }}
              >
                Pseudo
              </label>
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleInputChange}
                placeholder="Enter your pseudo"
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#1e1e30",
                  border: "1px solid #333",
                  color: "#fff",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                  textAlign: "left",
                }}
              >
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Enter your BossFighters user ID"
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#1e1e30",
                  border: "1px solid #333",
                  color: "#fff",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                  textAlign: "left",
                }}
              >
                Profile picture (optional)
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#2e2e40",
                      color: "#fff",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Choose an image"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </div>

                <p
                  style={{ fontSize: "0.8em", color: "#aaa", marginTop: "0px" }}
                >
                  This image will be used as your Atom's profile picture.
                </p>

                {formData.image && (
                  <div style={{ marginTop: "10px" }}>
                    <p
                      style={{
                        fontSize: "0.8em",
                        color: "#aaa",
                        marginBottom: "5px",
                      }}
                    >
                      Preview of the image:
                    </p>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #FFD32A",
                        margin: "0 auto",
                      }}
                    >
                      <img
                        src={
                          isIpfsUrl(formData.image)
                            ? ipfsToHttpUrl(formData.image)
                            : formData.image
                        }
                        alt="Aperçu"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleSubmit}
                disabled={isLoading || isUploading}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#FFD32A",
                  color: "#000",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  opacity: isLoading || isUploading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Creation..." : "CREATE YOUR ATOM"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
