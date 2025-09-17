import React from "react";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SidebarDrawer({
  open,
  onClose,
  children,
}: SidebarDrawerProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: open ? "16.67vw" : 0,
        minWidth: open ? "250px" : 0,
        backgroundColor: "#18181b",
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        transition: "width 0.35s cubic-bezier(0.4, 1.3, 0.5, 1)",
        zIndex: 1300,
        boxShadow: "2px 0 16px rgba(0, 0, 0, 0.18)",
        border: "2px solid #ffd32a",
        overflow: "hidden",
      }}
    >
      {open && (
        <>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#ffd32a",
              fontSize: 32,
              position: "absolute",
              top: 10,
              right: 18,
              cursor: "pointer",
              zIndex: 1302,
              transition: "color 0.2s",
            }}
            onClick={onClose}
          >
            ×
          </button>
          <div
            style={{
              padding: "48px 24px 24px 24px",
              overflowY: "auto",
              height: "100%",
              color: "#ffd32a",
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
