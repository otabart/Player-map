import React from "react";

type TransactionStatusType = {
  status: "idle" | "pending" | "success" | "error" | "approval_pending" | "whitelist_error";
  message: string;
};

interface TransactionStatusDisplayProps {
  transactionStatus: TransactionStatusType;
}

export const TransactionStatusDisplay: React.FC<TransactionStatusDisplayProps> = ({
  transactionStatus,
}) => {
  if (transactionStatus.status === "idle" || transactionStatus.status === "whitelist_error") {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "25px",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor:
          transactionStatus.status === "pending"
            ? "#10172d"
            : transactionStatus.status === "approval_pending"
            ? "rgba(255, 211, 42, 0.1)"
            : transactionStatus.status === "success"
            ? "rgba(0, 128, 0, 0.1)"
            : "rgba(255, 0, 0, 0.1)",
        color:
          transactionStatus.status === "success"
            ? "#4CAF50"
            : transactionStatus.status === "error"
            ? "#F44336"
            : transactionStatus.status === "approval_pending"
            ? "#FFD32A"
            : "#FFF",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #1e3b70",
      }}
    >
      <div>
        {transactionStatus.message}
      </div>
    </div>
  );
}; 