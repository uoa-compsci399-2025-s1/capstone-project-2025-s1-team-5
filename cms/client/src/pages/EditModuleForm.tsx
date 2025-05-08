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

useEffect(() => {
  const fetchSubsections = async () => {
    try {
      const responses = await Promise.all(
        module.subsectionIds.map((id) =>
          axios.get(`http://localhost:3000/modules/subsection/${id}`)
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
}, [module.subsectionIds]);

  const handleSubsectionChange = (id: string, field: keyof Subsection, value: string) => {
    setSubsections((prev) =>
      prev.map((subsection) =>
        subsection.id === id ? { ...subsection, [field]: value } : subsection
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedModule = {
      title,
      description,
      subsectionIds: module.subsectionIds,
    };

    try {
      // Update the module
      await axios.put(`http://localhost:3000/modules/${module.id}`, updatedModule);

      // Update subsections
      await Promise.all(
        subsections.map((subsection) =>
          axios.put(`http://localhost:3000/modules/subsection/${subsection.id}`, {
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
              <div style={{ marginBottom: "0.5rem" }}>
                <label>Title:</label>
                <input
                  type="text"
                  value={subsection.title}
                  onChange={(e) => handleSubsectionChange(subsection.id, "title", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
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