import React from 'react';

interface RedeemConfigProps {
  positionId: string;
  shares: number;
  redeemAmount: number;
  onAmountChange: (positionId: string, amount: number) => void;
}

const RedeemConfig: React.FC<RedeemConfigProps> = ({
  positionId,
  shares,
  redeemAmount,
  onAmountChange,
}) => {
  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "6px",
      minWidth: "200px"
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
        <input
          type="number"
          value={redeemAmount || shares}
          onChange={(e) => onAmountChange(positionId, parseFloat(e.target.value) || 0)}
          max={shares}
          min={0}
          step="0.000001"
          style={{
            width: "100%",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #374151",
            backgroundColor: "#232326",
            color: "#fff",
            fontSize: "12px",
          }}
        />
        <p style={{ color: "#9ca3af", fontSize: "10px" }}>
          Max: {shares}
        </p>
        
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {[
            { label: "25%", multiplier: 0.25 },
            { label: "50%", multiplier: 0.5 },
            { label: "75%", multiplier: 0.75 },
            { label: "Max", multiplier: 1 }
          ].map(({ label, multiplier }) => (
            <button
              key={label}
              onClick={() => onAmountChange(positionId, shares * multiplier)}
              style={{
                padding: "0px 4px",
                borderRadius: "4px",
                border: "1px solid #374151",
                backgroundColor: "#232326",
                color: "#fff",
                fontSize: "12px",
                cursor: "pointer",
                minWidth: "32px",
                textAlign: "center",
                height: "20px",
                lineHeight: "20px",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedeemConfig;
