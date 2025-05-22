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
  const [deleteConfirmSubsection, setDeleteConfirmSubsection] = useState<{index: number, title: string} | null>(null);

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

  const handleDeleteSubsection = (index: number) => {
    setSubsections(subsections.filter((_, i) => i !== index));
    setDeleteConfirmSubsection(null);
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
        `${process.env.REACT_APP_API_URL}/modules`, 
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
              `${process.env.REACT_APP_API_URL}/modules/${moduleId}`, 
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label>Title:</label>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSubsection({index, title: subsection.title})}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "0.2rem 0.5rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Delete Subsection
                </button>
              </div>
              <input
                type="text"
                value={subsection.title}
                onChange={(e) => handleSubsectionChange(index, "title", e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
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

      {deleteConfirmSubsection && (
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
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "center"
            }}
          >
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete the subsection "{deleteConfirmSubsection.title}"?</p>
            <p style={{ color: "#dc3545", fontWeight: "bold" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
              <button
                onClick={() => handleDeleteSubsection(deleteConfirmSubsection.index)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmSubsection(null)}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateModule;