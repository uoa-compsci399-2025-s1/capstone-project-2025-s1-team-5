import React, { useState, useEffect } from "react";
import axios from "axios";

interface Subsection {
  id: string;
  title: string;
  body: string;
}

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
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [moduleSubsectionIds, setModuleSubsectionIds] = useState<string[]>(module.subsectionIds || []);
  const [deleteConfirmSubsection, setDeleteConfirmSubsection] = useState<Subsection | null>(null);

  useEffect(() => {
    const fetchSubsections = async () => {
      try {
        const responses = await Promise.all(
          moduleSubsectionIds.map((id) =>
            axios.get(`${process.env.REACT_APP_API_URL}/api/modules/subsection/${id}`)
          )
        );
        setSubsections(
          responses.map((res) => ({
            ...res.data,
            id: res.data._id,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch subsections:", error);
      }
    };

    fetchSubsections();
  }, [moduleSubsectionIds]);

  const handleSubsectionChange = (id: string, field: keyof Subsection, value: string) => {
    setSubsections((prev) =>
      prev.map((subsection) =>
        subsection.id === id ? { ...subsection, [field]: value } : subsection
      )
    );
  };

  const handleAddSubsection = async () => {
    try {
      const newSubsectionData = {
        title: "New Subsection",
        body: "Enter content here...",
        authorID: "system"
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/modules/${module.id}`, 
        newSubsectionData
      );
      
      const newSubsectionId = response.data._id.toString();
      
      const newSubsection = {
        id: newSubsectionId,
        title: response.data.title,
        body: response.data.body
      };
      
      setSubsections([...subsections, newSubsection]);
      
      setModuleSubsectionIds([...moduleSubsectionIds, newSubsectionId]);
      
    } catch (error) {
      console.error("Failed to add subsection:", error);
    }
  };

  const handleDeleteSubsection = async (subsectionId: string) => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/modules/${module.id}/${subsectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSubsections(subsections.filter(sub => sub.id !== subsectionId));
      setModuleSubsectionIds(moduleSubsectionIds.filter(id => id !== subsectionId));
      setDeleteConfirmSubsection(null);
    } catch (error) {
      console.error("Failed to delete subsection:", error);
      alert("Failed to delete subsection. Please try again.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedModule = {
      title,
      description,
      subsectionIds: moduleSubsectionIds,
    };

    try {
      // Update the module
      await axios.put(`${process.env.REACT_APP_API_URL}/api/modules/${module.id}`, updatedModule);

      // Update subsections
      await Promise.all(
        subsections.map((subsection) =>
          axios.put(`${process.env.REACT_APP_API_URL}/api/modules/subsection/${subsection.id}`, {
            title: subsection.title,
            body: subsection.body,
          })
        )
      );

      onModuleUpdated();
      setEditModule(null);
    } catch (error) {
      console.error("Failed to update module or subsections:", error);
    }
  };

  return (
    <div>
      <h1>Edit Module</h1>
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
          <h3>Subsections</h3>
          {subsections.map((subsection) => (
            <div key={subsection.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label>Title:</label>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSubsection(subsection)}
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
                onChange={(e) => handleSubsectionChange(subsection.id, "title", e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
              <div>
                <label>Body:</label>
                <textarea
                  value={subsection.body}
                  onChange={(e) => handleSubsectionChange(subsection.id, "body", e.target.value)}
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
                onClick={() => handleDeleteSubsection(deleteConfirmSubsection.id)}
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

export default EditModuleForm;