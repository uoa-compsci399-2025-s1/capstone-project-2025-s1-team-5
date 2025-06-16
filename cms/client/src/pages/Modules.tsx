import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateModule from "./CreateModule";
import EditModuleForm from "./EditModuleForm";
import ModuleButton from "../components/ModuleButton";
import { Module, ModulesResponse } from "../types/interfaces";
import ModulesOrder from "./ModulesOrder";

const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [showCreateModule, setCreateModule] = useState(false);
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [deleteConfirmModule, setDeleteConfirmModule] = useState<Module | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOrderOverlay, setShowOrderOverlay] = useState(false);

  const fetchModules = async () => {
    try {
      const res = await axios.get<ModulesResponse>(
        `${process.env.REACT_APP_API_URL}/api/modules`
      );

      const mappedModules = res.data.modules.map((module) => ({
        ...module,
        _id: module._id || module.id || "",
      }));

      setModules(mappedModules);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      setError("Failed to fetch modules. Please refresh the page.");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDeleteModule = async (moduleId: string) => {
    try {
      if (!moduleId) {
        console.error("Module ID is undefined or empty");
        setError("Cannot delete module: ID is missing");
        return;
      }

      const token = localStorage.getItem("authToken");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/modules/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchModules();
      setDeleteConfirmModule(null);
      setError(null);
    } catch (error) {
      console.error("Failed to delete module:", error);
      setError("Failed to delete module. Please try again.");
    }
  };

  const sortedModules = [...modules].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "lastModified" && a.updatedAt && b.updatedAt) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-4">Manage Modules</h1>

      <input
        type="text"
        placeholder="Search modules by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full max-w-md shadow-sm ml-4"
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-gray-100 rounded-lg p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              className="p-2 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="lastModified">Last Modified</option>
            </select>
          </div>

          {}
          <div className="flex gap-2">
            <ModuleButton
              label="Reorder Modules"
              onClick={() => setShowOrderOverlay(true)}
              color="#17a2b8"
            />
            <ModuleButton
              label="Create Module"
              onClick={() => setCreateModule(true)}
              color="#28a745"
            />
          </div>
        </div>

        <div>
          {sortedModules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No modules found. Create your first module to get started.
            </div>
          ) : (
            sortedModules
              .filter((module) => {
                const title = module.title || "";
                const description = module.description || "";
                return (
                  title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  description.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((module) => (
                <div
                  key={module._id}
                  className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center shadow-sm"
                >
                  <div>
                    <h3 className="m-0">{module.title}</h3>
                    {module.updatedAt && (
                      <p className="mt-2 mb-0 text-sm text-gray-600">
                        Last modified: {new Date(module.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <ModuleButton
                      label="Edit"
                      onClick={() => setEditModule(module)}
                      color="#facc15"
                    />
                    <ModuleButton
                      label="Delete"
                      onClick={() => setDeleteConfirmModule(module)}
                      color="#dc3545"
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {showCreateModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <CreateModule
              onModuleCreated={() => {
                fetchModules();
                setCreateModule(false);
              }}
              setCreateModule={setCreateModule}
            />
          </div>
        </div>
      )}

      {editModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <EditModuleForm
              module={editModule}
              onModuleUpdated={() => {
                fetchModules();
                setEditModule(null);
              }}
              setEditModule={setEditModule}
            />
          </div>
        </div>
      )}

      {deleteConfirmModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-lg text-center">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the module "{deleteConfirmModule.title}"?
            </p>
            <p className="text-red-600 font-bold">
              This action will also delete all subsections of this module and cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  handleDeleteModule(
                    deleteConfirmModule._id || deleteConfirmModule.id || ""
                  )
                }
                className="bg-red-600 text-white border-none rounded py-2 px-4 cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmModule(null)}
                className="bg-gray-500 text-white border-none rounded py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showOrderOverlay && (
        <ModulesOrder
          key={modules.map((m) => m._id).join(",")}
          modules={modules}
          onClose={() => setShowOrderOverlay(false)}
          onOrderChanged={() => {
            fetchModules();
            setShowOrderOverlay(false);
          }}
        />
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
