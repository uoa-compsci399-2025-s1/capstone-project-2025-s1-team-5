import React, { useState } from "react";
import axios from "axios";

interface CreateModuleProps {
  onModuleCreated?: () => void;
}

const CreateModule: React.FC<CreateModuleProps> = ({ onModuleCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subsectionIds, setSubsectionIds] = useState<string[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubsectionIdsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value.split(",").map((id) => id.trim()); // Split by commas and trim
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
          <div>
            <label>Module Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: "1.5rem", fontWeight: "bold", width: "100%" }}
              placeholder="Enter module title"
              required
            />
          </div>
          <div>
            <label>Description Content:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", height: "100px" }}
              placeholder="Enter module description"
              required
            />
          </div>
          <div>
            <label>Subsection IDs (comma-separated):</label>
            <textarea
              value={subsectionIds.join(", ")}
              onChange={handleSubsectionIdsChange}
              style={{ width: "100%", height: "80px" }}
              placeholder="Enter subsection IDs separated by commas"
            />
          </div>
          <div>
            <button type="submit">Create Module</button>
          </div>
        </form>
  
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </div>
    );
  };
  
  export default CreateModule;