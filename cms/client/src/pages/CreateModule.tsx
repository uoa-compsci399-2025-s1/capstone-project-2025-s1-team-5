import React, { useState } from "react";
import axios from "axios";

interface Subsection {
  title: string;
  body: string;
}

interface CreateModuleProps {
  onModuleCreated?: () => void;
  setCreateModule: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateModule: React.FC<CreateModuleProps> = ({ onModuleCreated, setCreateModule }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubsectionChange = (index: number, field: keyof Subsection, value: string) => {
    setSubsections((prev) =>
      prev.map((subsection, i) =>
        i === index ? { ...subsection, [field]: value } : subsection
      )
    );
  };

  const handleAddSubsection = () => {
    setSubsections([...subsections, { title: "New Subsection", body: "Enter content here..." }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const moduleData = {
      title,
      description,
    };

    try {

      const token = localStorage.getItem("authToken");
      
      const moduleResponse = await axios.post(
        "http://localhost:3000/modules", 
        moduleData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const moduleId = moduleResponse.data.id || moduleResponse.data._id;
      
      if (subsections.length > 0) {
        await Promise.all(
          subsections.map(subsection => 
            axios.post(
              `http://localhost:3000/modules/${moduleId}`, 
              {
                title: subsection.title,
                body: subsection.body,
                authorID: "system"
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
          )
        );
      }
      
      setSuccess("Module created successfully!");
      setError(null);
      if (onModuleCreated) onModuleCreated();
    } catch (error: any) {
      setError("Error creating module: " + (error.response?.data?.message || error.message));
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
          <h3>Subsections</h3>
          {subsections.map((subsection, index) => (
            <div key={index} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <label>Title:</label>
                <input
                  type="text"
                  value={subsection.title}
                  onChange={(e) => handleSubsectionChange(index, "title", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label>Body:</label>
                <textarea
                  value={subsection.body}
                  onChange={(e) => handleSubsectionChange(index, "body", e.target.value)}
                  style={{ width: "100%", height: "80px" }}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddSubsection}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              marginTop: "1rem",
              width: "100%"
            }}
          >
            Add Subsection
          </button>
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