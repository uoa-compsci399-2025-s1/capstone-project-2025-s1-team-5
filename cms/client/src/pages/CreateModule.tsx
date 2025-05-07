import React, { useState } from "react";
import axios from "axios";

interface CreateModuleProps {
  onModuleCreated?: () => void;
  setCreateModule: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateModule: React.FC<CreateModuleProps> = ({ onModuleCreated, setCreateModule }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subsectionIds, setSubsectionIds] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubsectionIdsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value.split(",").map((id) => id.trim());
    setSubsectionIds(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const moduleData = {
      title,
      description,
      subsectionIds,
    };

    try {
      const response = await axios.post("http://localhost:3000/modules", moduleData);
      setSuccess("Module created successfully!");
      setError(null);
      console.log(response.data);
      if (onModuleCreated) onModuleCreated();
    } catch (error: any) {
      setError("Error creating module!");
      setSuccess(null);
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Module</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Module Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: "1.5rem", fontWeight: "bold", width: "100%" }}
            placeholder="Enter module title"
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Description Content:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", height: "100px" }}
            placeholder="Enter module description"
            required
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Subsection IDs (comma-separated):</label>
          <textarea
            value={subsectionIds.join(", ")}
            onChange={handleSubsectionIdsChange}
            style={{ width: "100%", height: "80px" }}
            placeholder="Enter subsection IDs separated by commas"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Create Module
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
            onClick={() => setCreateModule(false)}
          >
            Close
          </button>
        </div>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
    </div>
  );
};

export default CreateModule;