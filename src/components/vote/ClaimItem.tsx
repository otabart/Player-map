import React, { useState, useEffect } from "react";
import { VoteItem, VoteDirection } from "../../types/vote";
import { UNIT_VALUE } from "../../utils/voteConstants";

interface ClaimItemProps {
  voteItem: VoteItem;
  onChangeUnits: (id: bigint, direction: VoteDirection, units: number) => void;
}

export const ClaimItem: React.FC<ClaimItemProps> = ({ voteItem, onChangeUnits }) => {
  const { 
    id, 
    subject, 
    predicate, 
    object, 
    units, 
    direction, 
    vault_position_count = 0, 
    counter_vault_position_count = 0 
  } = voteItem;
  
  const [sliderValue, setSliderValue] = useState(0);
  
  // Maximum units to allow
  const MAX_UNITS = 20;
  
  useEffect(() => {
    // Set slider value based on direction and units
    if (direction === VoteDirection.For) {
      setSliderValue(units);
    } else if (direction === VoteDirection.Against) {
      setSliderValue(-units);
    } else {
      setSliderValue(0);
    }
  }, [units, direction]);
  
  const handleIncreaseFor = () => {
    const newValue = Math.min(sliderValue + 1, MAX_UNITS);
    setSliderValue(newValue);
    onChangeUnits(id, VoteDirection.For, newValue);
  };
  
  const handleDecreaseFor = () => {
    if (sliderValue <= 0) return;
    const newValue = sliderValue - 1;
    setSliderValue(newValue);
    if (newValue === 0) {
      onChangeUnits(id, VoteDirection.None, 0);
    } else {
      onChangeUnits(id, VoteDirection.For, newValue);
    }
  };
  
  const handleIncreaseAgainst = () => {
    const newValue = Math.max(sliderValue - 1, -MAX_UNITS);
    setSliderValue(newValue);
    onChangeUnits(id, VoteDirection.Against, Math.abs(newValue));
  };
  
  const handleDecreaseAgainst = () => {
    if (sliderValue >= 0) return;
    const newValue = sliderValue + 1;
    setSliderValue(newValue);
    if (newValue === 0) {
      onChangeUnits(id, VoteDirection.None, 0);
    } else {
      onChangeUnits(id, VoteDirection.Against, Math.abs(newValue));
    }
  };
  
  const isForActive = direction === VoteDirection.For && units > 0;
  const isAgainstActive = direction === VoteDirection.Against && units > 0;

  // Calculate ETH cost for this vote
  const costInEth = (Number(UNIT_VALUE) / 10**18) * units;

  return (
    <div
      style={{
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "8px",
        backgroundColor: "#0c1228",
        position: "relative",
        border: "1px solid #1e3b70",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Cost badge */}
      {units > 0 && (
        <div style={{ 
          position: "absolute", 
          top: "5px", 
          left: "5px", 
          backgroundColor: "#FFD32A", 
          color: "#000000",
          padding: "3px 6px",
          fontSize: "10px",
          fontWeight: "bold",
          borderRadius: "4px"
        }}>
          {costInEth.toFixed(3)} ETH
        </div>
      )}
      
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",  
      }}>
        {/* Left side - For */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: "0.9em", color: "#E1E1E1", marginRight: "10px" }}>
            For ▲:
          </div>
          <button
            onClick={handleDecreaseFor}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#1e2030",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            -
          </button>
          <span style={{ margin: "0 10px", color: "#ffffff", fontWeight: "bold" }}>
            {isForActive ? units : 0}
          </span>
          <button
            onClick={handleIncreaseFor}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#1976d2",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>

        {/* Triple details */}
        <div style={{ display: "flex", marginBottom: "20px", gap: "5px", marginTop: "20px" }}>
          <span style={{
            backgroundColor: "#FFB300",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.9em",
            color: "#000000",
            fontWeight: "bold"
          }}>
            {subject}
          </span>
          -
          <span style={{
            backgroundColor: "#ccd3d3",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.9em",
            color: "#000000",
            fontWeight: "bold"
          }}>
            {predicate}
          </span>
          -
          <span style={{
            backgroundColor: "#43A047",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.9em",
            color: "#000000",
            fontWeight: "bold"
          }}>
            {object}
          </span>
        </div>
        
        {/* Right side - Against */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: "0.9em", color: "#E1E1E1", marginRight: "10px" }}>
            Against ▼:
          </div>
          <button
            onClick={handleDecreaseAgainst}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#1e2030",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            -
          </button>
          <span style={{ margin: "0 10px", color: "#ffffff", fontWeight: "bold" }}>
            {isAgainstActive ? units : 0}
          </span>
          <button
            onClick={handleIncreaseAgainst}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "#dc3545",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div style={{ 
            fontSize: "0.7em", 
            color: "#4CAF50", 
            marginBottom: "8px",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontWeight: "bold"
          }}>
            {vault_position_count} positions
          </div>

          <div style={{ 
            fontSize: "0.7em", 
            color: "#F44336", 
            marginBottom: "8px",
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontWeight: "bold"
          }}>
            {counter_vault_position_count} positions
          </div>

      </div>
    </div>
  );
}; 