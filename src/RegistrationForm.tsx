import React from "react";
import IntuitionLogo from "./assets/img/logo.svg";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
}) => {
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
            MAKE A CLAIM ABOUT YOURSELF
          </h3>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.9em",
            marginBottom: "20px",
          }}
        >
          Contribute and help to build the Boss Fighters ecosystem !
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.9em",
              textAlign: "left",
            }}
          >
            What is your Boss Fighter user ID ?
          </label>
          <input
            type="text"
            placeholder="YOUR-BOSS-FIGHTERS-IDENTIFICATOR"
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
            Are you member of a guild on Boss Fighters ?
          </label>
          <select
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#1e1e30",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
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
            Are you a PC fighter player ?
          </label>
          <select
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#1e1e30",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
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
            Are you a PC or VR Boss player ?
          </label>
          <select
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#1e1e30",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            <option value="">Select</option>
            <option value="pc">PC</option>
            <option value="vr">VR</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.9em",
              textAlign: "left",
            }}
          >
            Add Intuition Agent code if you have one :
          </label>
          <input
            type="text"
            placeholder="CODE"
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

        <div style={{ textAlign: "center" }}>
          <button
            style={{
              padding: "8px 20px",
              backgroundColor: "#FFD32A",
              color: "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            VALIDATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
