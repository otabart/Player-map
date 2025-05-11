import React, { useState, useEffect, useRef } from "react";
import IntuitionLogo from "./assets/img/logo.svg";
import { ATOM_CONTRACT_CHAIN_ID, ATOM_CONTRACT_ADDRESS, atomABI } from "./abi";
import {
  usePlayerCreationService,
  PlayerData,
} from "./services/playerCreationService";
import { ipfsToHttpUrl, isIpfsUrl, uploadToPinata } from "./utils/pinata";

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

// Composant pour prévisualiser une image
const PreviewImage = ({ src }: { src: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (isIpfsUrl(src)) {
        const httpUrl = await ipfsToHttpUrl(src);
        setImageUrl(httpUrl);
      } else {
        setImageUrl(src);
      }
    };

    loadImage();
  }, [src]);

  if (!imageUrl) return <div>Loading image...</div>;

  return (
    <img
      src={imageUrl}
      alt="preview"
      style={{
        width: "100%",
        maxHeight: "150px",
        objectFit: "contain",
      }}
    />
  );
};

const PlayerCreationForm: React.FC<PlayerCreationFormProps> = ({
  isOpen,
  onClose,
  walletConnected,
  walletAddress,
  wagmiConfig,
  publicClient,
  walletHooks,
}) => {
  // État du formulaire et autres états
  const [formData, setFormData] = useState<PlayerData>({
    pseudo: "",
    userId: "",
    image: "",
  });
  const [hasExistingAtom, setHasExistingAtom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAtom, setIsCreatingAtom] = useState(false);
  const [isCreatingTriples, setIsCreatingTriples] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [atomId, setAtomId] = useState<string | null>(null);
  const [tripleCreated, setTripleCreated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1); // 1: création de l'atome, 2: création des triples, 3: succès
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Récupérer le publicClient depuis les hooks si disponible et non fourni directement
  const effectivePublicClient =
    publicClient ||
    (walletHooks?.usePublicClient && walletHooks.usePublicClient());

  // Service de création de joueur
  const { createPlayer } = usePlayerCreationService(
    walletConnected,
    walletAddress || "",
    effectivePublicClient
  );

  // Vérifier si l'utilisateur a déjà un atome
  useEffect(() => {
    const checkExistingAtom = async () => {
      if (!walletAddress || !walletConnected) return;

      try {
        // Utiliser le publicClient si disponible pour cette lecture
        const client = effectivePublicClient || walletConnected;

        // Vérifier avec balanceOf
        const balance = await client.readContract({
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
  }, [walletAddress, walletConnected, effectivePublicClient]);

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer l'upload de fichier
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

  // Création complète du joueur
  const handleSubmit = async () => {
    if (!walletAddress || !walletConnected) {
      alert("Veuillez connecter votre portefeuille d'abord");
      return;
    }

    if (hasExistingAtom) {
      alert("Vous avez déjà un atome !");
      return;
    }

    if (!formData.pseudo || !formData.userId) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setIsLoading(true);
      setIsCreatingAtom(true);
      setStep(1);

      // Création de l'atome
      console.log("Démarrage de la création du joueur...");
      const result = await createPlayer(formData);

      // Atome créé avec succès
      setAtomId(result.atomId.toString());
      setIsCreatingAtom(false);

      // Création des triples
      setIsCreatingTriples(true);
      setStep(2);

      // Vérification si les triples ont été créés
      if (result.tripleCreated) {
        // Succès complet
        setTripleCreated(true);
        setCreationSuccess(true);
        setIsCreatingTriples(false);
        setIsLoading(false);
        setStep(3);

        // Fermer le formulaire après 3 secondes
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        // Atome créé mais échec des triples
        setTripleCreated(false);
        setIsCreatingTriples(false);
        setIsLoading(false);
        setStep(3);

        // Avertir l'utilisateur de l'état partiel
        alert(
          "Votre identité a été créée, mais la création des triples associés a échoué. Vous pourrez réessayer plus tard."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création du joueur:", error);

      // Distinction des messages d'erreur
      if (isCreatingAtom) {
        alert("Erreur lors de la création de l'atome. Veuillez réessayer.");
      } else if (isCreatingTriples) {
        alert(
          "Erreur lors de la création des triples. Votre identité a été créée, mais les triples ont échoué."
        );
      } else {
        alert("Erreur lors de la création du joueur. Veuillez réessayer.");
      }

      setIsCreatingAtom(false);
      setIsCreatingTriples(false);
      setIsLoading(false);
    }
  };

  // Si le modal n'est pas ouvert, ne rien rendre
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
              : "Non connecté"}
          </div>
          <div>Connected: {String(!!walletConnected)}</div>
          <div>Has Atom: {String(hasExistingAtom)}</div>
          <div>Step: {step}</div>
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
            CRÉER VOTRE JOUEUR
          </h3>
          <p style={{ fontSize: "0.8em", color: "#aaa" }}>
            Réseau: Base Sepolia (Chain ID: {ATOM_CONTRACT_CHAIN_ID})
          </p>
        </div>

        {/* Progression du processus */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "15px",
                  backgroundColor:
                    isCreatingAtom || step > 1 ? "#FFD32A" : "#2e2e40",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: isCreatingAtom || step > 1 ? "#000" : "#fff",
                }}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <p style={{ fontSize: "0.8em", marginTop: "5px" }}>
                Création Atom
              </p>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "15px",
                  backgroundColor:
                    isCreatingTriples || step > 2 ? "#FFD32A" : "#2e2e40",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: isCreatingTriples || step > 2 ? "#000" : "#fff",
                }}
              >
                {step > 2 ? "✓" : "2"}
              </div>
              <p style={{ fontSize: "0.8em", marginTop: "5px" }}>
                Création Triples
              </p>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "15px",
                  backgroundColor: step === 3 ? "#4CAF50" : "#2e2e40",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: step === 3 ? "#000" : "#fff",
                }}
              >
                {step === 3 ? "✓" : "3"}
              </div>
              <p style={{ fontSize: "0.8em", marginTop: "5px" }}>Succès</p>
            </div>
          </div>
          <div
            style={{
              height: "4px",
              backgroundColor: "#2e2e40",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${(step - 1) * 50}%`,
                backgroundColor: "#FFD32A",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
        </div>

        {creationSuccess ? (
          <div style={{ textAlign: "center", color: "#4CAF50" }}>
            <h3 style={{ color: "#4CAF50", marginBottom: "10px" }}>Succès!</h3>
            <p>Votre joueur a été créé avec succès.</p>
            <p>Atom ID: {atomId}</p>
            <p>Triples créés: {tripleCreated ? "Oui" : "Non"}</p>
            <p>Cette fenêtre se fermera automatiquement...</p>
          </div>
        ) : !walletAddress ? (
          <div>
            <p style={{ textAlign: "center", color: "#ff4444" }}>
              Veuillez connecter votre portefeuille d'abord
            </p>
          </div>
        ) : hasExistingAtom ? (
          <p style={{ textAlign: "center", color: "#ff4444" }}>
            Vous avez déjà un atome associé à ce portefeuille
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
                placeholder="Entrez votre pseudo"
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
                placeholder="Entrez votre ID BossFighters"
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
                Photo de profil (optionnel)
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
                    {isUploading ? "Upload en cours..." : "Choisir une image"}
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
                  Cette image sera utilisée comme photo de profil de votre
                  joueur.
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
                      Aperçu de l'image:
                    </p>
                    <PreviewImage src={formData.image} />
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
                {isLoading
                  ? isCreatingAtom
                    ? "Création de l'atome..."
                    : isCreatingTriples
                    ? "Création des triples..."
                    : "Création en cours..."
                  : "CRÉER VOTRE JOUEUR"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerCreationForm;
