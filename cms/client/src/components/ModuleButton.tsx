import React from "react";

interface ModuleButtonProps {
  label: string;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

const ModuleButton: React.FC<ModuleButtonProps> = ({ label, onClick, color = "#007bff" }) => {
  return (
    <button
      style={{
        backgroundColor: color,
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        padding: "0.5rem 1rem",
        margin: "0.5rem",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ModuleButton;