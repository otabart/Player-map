import React from "react";
import { VoteItem, VoteDirection } from "../../types/vote";
import { ClaimItem } from "./ClaimItem";

interface ClaimListProps {
  isLoading: boolean;
  voteItems: VoteItem[];
  onChangeUnits: (id: bigint, direction: VoteDirection, units: number) => void;
}

export const ClaimList: React.FC<ClaimListProps> = ({
  isLoading,
  voteItems,
  onChangeUnits,
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
        />
      ))}
    </div>
  );
}; 