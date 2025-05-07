import React, { useState } from "react";
import axios from "axios";

interface Module {
  id: string;
  title: string;
  description: string;
  subsectionIds: string[];
  updatedAt: string;
}

interface EditModuleFormProps {
  module: Module;
  onModuleUpdated: () => void;
  setEditModule: React.Dispatch<React.SetStateAction<Module | null>>;
}

const EditModuleForm: React.FC<EditModuleFormProps> = ({ module, onModuleUpdated, setEditModule }) => {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [subsectionIds, setSubsectionIds] = useState(module.subsectionIds.join(", "));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedModule = {
      title,
      description,
      subsectionIds: subsectionIds.split(",").map((id) => id.trim()),
    };

    try {
      await axios.put(`http://localhost:3000/modules/${module.id}`, updatedModule);
      onModuleUpdated();
      setEditModule(null);
    } catch (error) {
      console.error("Failed to update module:", error);
    }
  };

  return (
    <div>
      <h2>Edit Module</h2>
      <p style={{ fontSize: "1rem", color: "#555" }}>
        Last modified: {new Date(module.updatedAt).toLocaleString()}
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: "1.5rem", fontWeight: "bold", width: "100%" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", height: "100px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Subsection IDs (comma-separated):</label>
          <textarea
            value={subsectionIds}
            onChange={(e) => setSubsectionIds(e.target.value)}
            style={{ width: "100%", height: "80px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Update Module
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
            onClick={() => setEditModule(null)}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModuleForm;