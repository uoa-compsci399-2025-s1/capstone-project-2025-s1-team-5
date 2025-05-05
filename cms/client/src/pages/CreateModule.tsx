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
  
    const handleSubsectionIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        console.log(response.data); // Handle response data (created module)
      } catch (error: any) {
        setError("Error creating module!");
        setSuccess(null);
        console.error(error);
      }
    };
    
    /*const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      const moduleData = {
        title,
        description,
        subsectionIds,
      };
    
      try {
        // Retrieve the token from localStorage or SecureStore
        const token = localStorage.getItem("USER_TOKEN"); // Adjust if stored elsewhere
    
        if (!token) {
          setError("You are not authenticated. Please log in.");
          return;
        }
    
        // Make the POST request with the Authorization header
        const response = await axios.post("http://localhost:3000/modules", moduleData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        setSuccess("Module created successfully!");
        setError(null);
        console.log(response.data); // Handle response data (created module)
      } catch (error: any) {
        setError("Error creating module!");
        setSuccess(null);
        console.error(error);
      }
    };*/
  
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
              required
            />
          </div>
          <div>
          <label>Description Content:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subsection IDs (comma-separated):</label>
            <input
                type="text"
                onChange={handleSubsectionIdsChange}
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