import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateModule from "./CreateModule";
import EditModuleForm from "./EditModuleForm";
import ModuleButton from "../components/ModuleButton";

interface Module {
  id: string;
  title: string;
  description: string;
  subsectionIds: string[];
  updatedAt: string;
}

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [editModule, setEditModule] = useState<Module | null>(null);

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:3000/modules");
      console.log("Fetched modules:", res.data);
      setModules(res.data.modules);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const sortedModules = [...modules].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "lastModified") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(); // Sort by newest first
    }
    return 0;
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "2rem" }}>
        UOA YOUR WAY: Module Management
      </h1>

      <div
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="sort" style={{ marginRight: "0.5rem" }}>
              Sort by:
            </label>
            <select
              id="sort"
              style={{ padding: "0.5rem", borderRadius: "5px" }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="lastModified">Last Modified</option>
            </select>
          </div>
          <ModuleButton
            label="Create Module"
            onClick={() => setShowCreateModule(true)}
            color="#28a745"
          />
        </div>

        <div>
          {sortedModules
            .filter((module) =>
              module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              module.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((module) => (
              <div
                key={module.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{module.title}</h3>
                  <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#555" }}>
                    Last modified: {new Date(module.updatedAt).toLocaleString()}
                  </p>
                </div>
                <ModuleButton
                  label="Edit"
                  onClick={() => setEditModule(module)}
                  color="#007bff"
                />
              </div>
            ))}
        </div>
      </div>

      {showCreateModule && (
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
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "2rem",
              width: "500px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CreateModule
              onModuleCreated={() => {
                fetchModules();
                setShowCreateModule(false);
              }}
            />
            <ModuleButton
              label="Close"
              onClick={() => setShowCreateModule(false)}
              color="#dc3545"
            />
          </div>
        </div>
      )}

      {editModule && (
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
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "2rem",
              width: "500px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <EditModuleForm
              module={editModule}
              onModuleUpdated={() => {
                fetchModules();
                setEditModule(null);
              }}
              setEditModule={setEditModule}
            />
            <ModuleButton
              label="Close"
              onClick={() => setEditModule(null)}
              color="#dc3545"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function ModulesPageWithLayout() {
  return (
    <div>
      <ModulesPage />
    </div>
  );
}