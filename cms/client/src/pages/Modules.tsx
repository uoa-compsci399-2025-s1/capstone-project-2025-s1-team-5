// src/pages/Modules.tsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";               // your axios instance
import CreateModule from "./CreateModule";
import EditModuleForm from "./EditModuleForm";
import ModuleButton from "../components/ModuleButton";
import Modal from "../components/Modal";

export interface Module {
  id: string;
  title: string;
  subsectionIds: string[];
  updatedAt: string;
}

const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<"title" | "lastModified">("title");
  const [showCreateModule, setShowCreateModule] = useState<boolean>(false);
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [deleteConfirmModule, setDeleteConfirmModule] = useState<Module | null>(null);

  // Fetch modules from backend
  const fetchModules = async () => {
    try {
      const res = await api.get<{ modules: Module[] }>("/modules");
      setModules(res.data.modules);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Delete a module (and its subsections)
  const handleDeleteModule = async (moduleId: string) => {
    try {
      await api.delete(`/modules/${moduleId}`);
      fetchModules();
      setDeleteConfirmModule(null);
    } catch (err) {
      console.error("Failed to delete module:", err);
      alert("删除失败，请重试");
    }
  };

  // Filter by title only (no description)
  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by title or lastModified
  const sortedModules = [...filtered].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "2rem" }}>
        UOA YOUR WAY: Module Management
      </h1>

      {/* Controls: Search, Sort, Create */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: 10,
          padding: "1.5rem",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          style={{ padding: "0.5rem", borderRadius: 5 }}
        >
          <option value="title">Title</option>
          <option value="lastModified">Last Modified</option>
        </select>
        <ModuleButton
          label="Create Module"
          onClick={() => setShowCreateModule(true)}
          color="#28a745"
        />
      </div>

      {/* Module List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {sortedModules.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{m.title}</h3>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#555" }}>
                Last modified: {new Date(m.updatedAt).toLocaleString()}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <ModuleButton
                label="Edit"
                onClick={() => setEditModule(m)}
                color="#007bff"
              />
              <ModuleButton
                label="Delete"
                onClick={() => setDeleteConfirmModule(m)}
                color="#dc3545"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Module Modal */}
      {showCreateModule && (
        <Modal onClose={() => setShowCreateModule(false)}>
          <CreateModule
            onModuleCreated={() => {
              fetchModules();
              setShowCreateModule(false);
            }}
            setCreateModule={setShowCreateModule}
          />
        </Modal>
      )}

      {/* Edit Module Modal */}
      {editModule && (
        <Modal onClose={() => setEditModule(null)}>
          <EditModuleForm
            module={editModule}
            onModuleUpdated={() => {
              fetchModules();
              setEditModule(null);
            }}
            setEditModule={setEditModule}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModule && (
        <Modal onClose={() => setDeleteConfirmModule(null)}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete “{deleteConfirmModule.title}”?</p>
          <p style={{ color: "#dc3545", fontWeight: "bold" }}>
            This will also delete its subsections.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => handleDeleteModule(deleteConfirmModule.id)}
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: 5,
              }}
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirmModule(null)}
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: 5,
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModulesPage;
