import React, { useState } from "react";
import axios from "axios";

// Updated Module interface to include updatedAt
interface Module {
  id: string;
  title: string;
  description: string;
  subsectionIds: string[];
  updatedAt: string; // Added updatedAt field
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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: "1.5rem", fontWeight: "bold", width: "100%" }}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", height: "100px" }}
            required
          />
        </div>
        <div>
          <label>Subsection IDs (comma-separated):</label>
          <textarea
            value={subsectionIds}
            onChange={(e) => setSubsectionIds(e.target.value)}
            style={{ width: "100%", height: "80px" }}
          />
        </div>
        <div>
          <label>Last Modified:</label>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            {new Date(module.updatedAt).toLocaleString()}
          </p>
        </div>
        <button type="submit">Update Module</button>
      </form>
      <button onClick={() => setEditModule(null)}>Cancel</button>
    </div>
  );
};

export default EditModuleForm;