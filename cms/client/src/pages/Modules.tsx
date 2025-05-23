// src/pages/Modules.tsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";
import CreateModule from "./CreateModule";
import EditModuleForm, { ModuleType as ModuleType } from "./EditModuleForm";
import ModuleButton from "../components/ModuleButton";
import Modal from "../components/Modal";

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"title" | "lastModified">("title");
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [editModule, setEditModule] = useState<ModuleType | null>(null);
  const [deleteConfirmModule, setDeleteConfirmModule] = useState<ModuleType | null>(null);

  const fetchModules = async () => {
    try {
      const res = await api.get<{ modules: ModuleType[] }>("/modules");
      setModules(res.data.modules);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDeleteModule = async (id: string) => {
    try {
      await api.delete(`/modules/${id}`);
      fetchModules();
      setDeleteConfirmModule(null);
    } catch (err) {
      console.error(err);
      alert("删除失败，请重试");
    }
  };

  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        UOA YOUR WAY: Module Management
      </h1>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          style={{ padding: 8, borderRadius: 4 }}
        >
          <option value="title">Title</option>
          <option value="lastModified">Last Modified</option>
        </select>
        <ModuleButton label="Create Module" onClick={() => setShowCreateModule(true)} color="#28a745" />
      </div>

      {/* Module List */}
      <div style={{ display: "grid", gap: 12 }}>
        {sorted.map((m) => (
          <div
            key={m.id}
            style={{
              padding: 16,
              backgroundColor: "#fff",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{m.title}</h3>
              <small style={{ color: "#666" }}>
                Last modified: {new Date(m.updatedAt).toLocaleString()}
              </small>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <ModuleButton label="Edit" onClick={() => setEditModule(m)} color="#007bff" />
              <ModuleButton label="Delete" onClick={() => setDeleteConfirmModule(m)} color="#dc3545" />
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
          <p>
            Are you sure you want to delete “{deleteConfirmModule.title}”?
            This will remove all its subsections as well.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={() => handleDeleteModule(deleteConfirmModule.id)}
              style={{ background: "#dc3545", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 4 }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteConfirmModule(null)}
              style={{ background: "#6c757d", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 4 }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
