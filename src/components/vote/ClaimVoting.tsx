import React, { useState, useEffect } from "react";
import { Network } from "../../hooks/useAtomData";
import { useSubmitVotes } from "../../hooks/useSubmitVotes";
import { useVoteItemsManagement } from "../../hooks/useVoteItemsManagement";
import { TransactionInfo } from "./TransactionInfo";
import { VotingHeader } from "./VotingHeader";
import { ClaimList } from "./ClaimList";
import { SubmitButton } from "./SubmitButton";
import { TransactionStatusDisplay } from "./TransactionStatus";
import { ConnectWalletModal, CreatePlayerModal } from "../modals";
import { useTripleByCreator } from "../../hooks/useTripleByCreator";
import { PLAYER_TRIPLE_TYPES } from "../../utils/constants";
import RegistrationForm from "../../RegistrationForm";

interface ClaimVotingProps {
  walletConnected?: any;
  walletAddress?: string;
  publicClient?: any;
  onClose?: () => void;
  network?: Network;
  onConnectWallet?: () => void;
  onCreatePlayer?: () => void;
  wagmiConfig?: any;
  walletHooks?: any;
}

export const ClaimVoting: React.FC<ClaimVotingProps> = ({
  walletConnected,
  walletAddress,
  publicClient,
  onClose,
  network = Network.TESTNET,
  onConnectWallet,
  onCreatePlayer,
  wagmiConfig,
  walletHooks,
}) => {
  // État pour gérer l'ouverture du formulaire d'inscription
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  // État pour gérer l'affichage de la modale CreatePlayerModal
  const [showCreatePlayerModal, setShowCreatePlayerModal] = useState(false);

  // Vérifier si le wallet est connecté
  const [isWalletReady, setIsWalletReady] = useState(false);
  
  // Vérifier si l'utilisateur a un player
  const lowerCaseAddress = walletAddress ? walletAddress.toLowerCase() : "";
  
  // Vérifier si l'utilisateur a un Player atom sur le jeu
  const {
    loading: tripleLoading,
    triples: playerTriples,
  } = useTripleByCreator(
    lowerCaseAddress, 
    Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.predicateId), 
    Number(PLAYER_TRIPLE_TYPES.IS_PLAYER_GAMES.objectId), 
    network
  );
  
  // Vérifie si l'utilisateur a un player atom
  const hasPlayerAtom = playerTriples.length > 0;

  // Mettre à jour isWalletReady quand walletAddress change
  useEffect(() => {
    const hasConnectedWallet = Boolean(walletAddress && walletAddress !== "");
    setIsWalletReady(hasConnectedWallet);
  }, [walletAddress]);

  // Mettre à jour l'affichage de la modale CreatePlayerModal
  useEffect(() => {
    if (isWalletReady && !hasPlayerAtom && !tripleLoading) {
      setShowCreatePlayerModal(true);
    } else {
      setShowCreatePlayerModal(false);
    }
  }, [isWalletReady, hasPlayerAtom, tripleLoading]);

  // Use the vote items management hook
  const {
    voteItems,
    isLoading,
    totalUnits,
    numberOfTransactions,
    handleChangeUnits,
    resetAllVotes,
    isVoteDirectionAllowed
  } = useVoteItemsManagement({
    network,
    walletAddress: lowerCaseAddress,
    onError: (message) => {
      setTransactionStatus({
        status: "error",
        message
      });
    }
  });

  // Use hook for submitting votes
  const { 
    submitVotes, 
    isSubmitting, 
    isDepositLoading, 
    transactionStatus, 
    setTransactionStatus 
  } = useSubmitVotes({
    walletConnected,
    walletAddress,
    publicClient,
    network,
    onSuccess: resetAllVotes
  });

  // Function to submit votes
  const handleSubmit = async () => {
    await submitVotes(voteItems);
  };

  // Fonction pour gérer le clic sur le bouton "Create Player"
  const handleCreatePlayer = () => {
    setShowCreatePlayerModal(false);
    setIsRegistrationFormOpen(true);
    if (onCreatePlayer) {
      onCreatePlayer();
    }
  };

  // Fonction pour fermer le formulaire d'inscription
  const handleCloseRegistrationForm = () => {
    setIsRegistrationFormOpen(false);
  };

  // Fonction pour fermer la modale CreatePlayerModal et tout le composant de vote
  const handleCloseCreatePlayerModal = () => {
    setShowCreatePlayerModal(false);
    
    // Fermer tout le composant de vote en appelant onClose
    if (onClose) {
      onClose();
    }
  };

  // Si l'utilisateur n'a pas connecté son wallet, afficher juste la modale de connexion
  if (!isWalletReady) {
    return (
      <div
        style={{
          backgroundColor: "#070b1a",
          minHeight: "50vh",
          opacity: "0.9",
          color: "#fff",
          padding: "15px",
          border: "1px solid #1e3b70",
          borderRadius: "8px",
          maxWidth: "960px",
          margin: "0 auto",
          position: "relative",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <ConnectWalletModal
          isOpen={true}
          onConnectWallet={onConnectWallet || (() => {})}
        />
      </div>
    );
  }

  // Si l'utilisateur a connecté son wallet mais n'a pas de player
  if (isWalletReady && !hasPlayerAtom && !tripleLoading) {
    return (
      <div
        style={{
          backgroundColor: "#070b1a",
          minHeight: "50vh",
          color: "#fff",
          padding: "15px",
          border: "1px solid #1e3b70",
          borderRadius: "8px",
          maxWidth: "960px",
          margin: "0 auto",
          position: "relative",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <CreatePlayerModal
          isOpen={true}
          onCreatePlayer={handleCreatePlayer}
          onClose={handleCloseCreatePlayerModal}
        />
        
        {/* Formulaire d'inscription */}
        <RegistrationForm
          isOpen={isRegistrationFormOpen}
          onClose={handleCloseRegistrationForm}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          wagmiConfig={wagmiConfig}
          walletHooks={walletHooks}
        />
      </div>
    );
  }

  // Affichage normal si wallet connecté et player existe
  return (
    <div
      style={{
        backgroundColor: "#070b1a",
        minHeight: "50vh",
        opacity: "0.9",
        color: "#fff",
        padding: "15px",
        border: "1px solid #1e3b70",
        borderRadius: "8px",
        maxWidth: "960px",
        margin: "0 auto",
        position: "relative",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <VotingHeader onClose={onClose} />
      <TransactionInfo
        numberOfTransactions={numberOfTransactions}
        totalUnits={totalUnits}
        onResetAll={resetAllVotes}
      />
      <ClaimList
        isLoading={isLoading || tripleLoading}
        voteItems={voteItems}
        onChangeUnits={handleChangeUnits}
        isVoteDirectionAllowed={isVoteDirectionAllowed}
        walletAddress={lowerCaseAddress}
        network={network}
      />
      <SubmitButton
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDepositLoading={isDepositLoading}
        totalUnits={totalUnits}
        numberOfTransactions={numberOfTransactions}
      />
      <TransactionStatusDisplay transactionStatus={transactionStatus} />
    </div>
  );
}; 