import React from "react";
import { VoteItem, VoteDirection } from "../../types/vote";
import { ClaimItem } from "./ClaimItem";
import { Network } from "../../hooks/useAtomData";
import { DefaultPlayerMapConstants } from "../../types/PlayerMapConfig";

interface ClaimListProps {
  isLoading: boolean;
  voteItems: VoteItem[];
  onChangeUnits: (id: bigint, direction: VoteDirection, units: number) => void;
  isVoteDirectionAllowed?: (tripleId: bigint, direction: VoteDirection) => boolean;
  walletAddress?: string;
  network?: Network;
  constants: DefaultPlayerMapConstants; // Constantes injectées
}

export const ClaimList: React.FC<ClaimListProps> = ({
  isLoading,
  voteItems,
  onChangeUnits,
  isVoteDirectionAllowed,
  walletAddress = "",
  network = Network.MAINNET,
  constants
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "30px", color: "#6b7280", fontSize: "1.1em" }}>
        Loading claims...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "25px" }}>
      {voteItems.map((item) => (
        <ClaimItem
          key={item.id.toString()}
          voteItem={item}
          onChangeUnits={onChangeUnits}
          isVoteDirectionAllowed={isVoteDirectionAllowed}
          walletAddress={walletAddress}
          network={network}
          constants={constants} // Passer les constantes personnalisées !
        />
      ))}
    </div>
  );
}; 