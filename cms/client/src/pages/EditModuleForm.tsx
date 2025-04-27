import React, { useState } from "react";
import axios from "axios";

interface Module {
  id: string;
  title: string;
  description: string;
  subsectionIds: string[];
}

interface EditModuleFormProps {
  module: Module; // The module being edited
  onModuleUpdated: () => void; // Function to call when module is updated
  setEditModule: React.Dispatch<React.SetStateAction<Module | null>>; // Function to reset the editModule state
}

const EditModuleForm: React.FC<EditModuleFormProps> = ({ module, onModuleUpdated, setEditModule }) => {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [subsectionIds, setSubsectionIds] = useState(module.subsectionIds.join(", "));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedModule = {
      "title": title,
      "description": description,
      "subsectionIds": subsectionIds.split(",").map((id) => id.trim()),
    };

    try {
      await axios.put(`http://localhost:3000/modules/${module.id}`, updatedModule);
      onModuleUpdated(); // Refresh the list of modules
      setEditModule(null); // Close the edit form
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
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subsection IDs (comma-separated):</label>
          <input
            type="text"
            value={subsectionIds}
            onChange={(e) => setSubsectionIds(e.target.value)}
            placeholder="Enter subsection IDs separated by commas"
          />
        </div>
        <button type="submit">Update Module</button>
      </form>
      <button onClick={() => setEditModule(null)}>Cancel</button>
    </div>
  );
};

export default EditModuleForm;