import React from "react";

interface ModuleModalProps {
  module: { id: string; title: string; description: string } | null;
  onClose: () => void;
}

const ModuleModal: React.FC<ModuleModalProps> = ({ module, onClose }) => {
  if (!module) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "2rem",
          width: "500px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2>{module.title}</h2>
        <p>{module.description}</p>
        <button
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            marginTop: "1rem",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModuleModal;