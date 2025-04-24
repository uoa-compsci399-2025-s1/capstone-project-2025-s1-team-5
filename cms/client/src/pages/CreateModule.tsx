import React, { useState } from "react";
import axios from "axios";

const CreateModule = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const moduleData = {
        title,
        description,
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
            <button type="submit">Create Module</button>
          </div>
        </form>
  
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </div>
    );
  };
  
  export default CreateModule;