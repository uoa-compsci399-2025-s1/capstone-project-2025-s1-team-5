import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateModule from "./CreateModule";
import EditModuleForm from "./EditModuleForm";

interface Module {
  id: string;
  title: string;
  description: string;
  subsectionIds: string[];
}

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Module | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editModule, setEditModule] = useState<Module | null>(null);

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:3000/modules");
      setModules(res.data.modules);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const sortModules = (data: Module[]) => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  };

  const handleSort = (key: keyof Module) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleEdit = (module: Module) => {
    setEditModule(module);
  };

  const handleDelete = async (moduleId: string) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await axios.delete(`http://localhost:3000/modules/${moduleId}`);
        fetchModules(); // Refresh list
      } catch (error) {
        console.error("Failed to delete module:", error);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Manage Modules</h1>
      <input
        type="text"
        placeholder="Search modules by title or description:"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
      />

      <h2 style={{ marginTop: "2rem" }}>All Modules</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th onClick={() => handleSort("title")} style={{ cursor: "pointer" , userSelect: "none" }}>
              Name {sortKey === "title" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("description")} style={{ cursor: "pointer" , userSelect: "none" }}>
              Email {sortKey === "description" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortModules(
            modules.filter((module) =>
              `${module.title} ${module.description}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
          ).map((module) => (
            <tr key={module.id}>
              <td>{module.title}</td>
              <td>{module.description}</td>
              <td>
                <button onClick={() => handleEdit(module)}>Edit</button>
                <button onClick={() => handleDelete(module.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModule && (
        <EditModuleForm
          module={editModule}
          onModuleUpdated={fetchModules}
          setEditModule={setEditModule}
        />
      )}

      <CreateModule onModuleCreated={fetchModules} />
    </div>
  );
};

export default ModulesPage;