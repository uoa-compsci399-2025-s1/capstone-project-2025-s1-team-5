// src/pages/Modules.tsx
import React, { useEffect, useState } from "react";
import api from "../lib/api"; // 你自己的 axios 实例
import CreateModule from "./CreateModule";
import EditModuleForm, { ModuleType } from "./EditModuleForm";
import ModuleButton from "../components/ModuleButton";
import Modal from "../components/Modal";

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"title" | "lastModified">("title");
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [editModule, setEditModule] = useState<ModuleType | null>(null);
  const [deleteConfirmModule, setDeleteConfirmModule] = useState<ModuleType | null>(null);

  // 拉取模块列表
  const fetchModules = async () => {
    try {
      const res = await api.get<{ modules: ModuleType[] }>("/modules");
      setModules(res.data.modules);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
      alert("拉取模块失败，请重试");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // 删除模块（连带子节）
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

  // 搜索 & 排序
  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedModules = [...filtered].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="p-8 font-sans">
      {/* 标题 */}
      <h1 className="text-4xl text-center mb-8">
        UOA YOUR WAY: Module Management
      </h1>

      {/* 搜索、排序、创建 */}
      <div className="bg-gray-100 rounded-lg p-8 shadow-md mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded flex-grow"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="p-2 border border-gray-300 rounded"
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

      {/* 模块列表 */}
      <div className="grid gap-4">
        {sortedModules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="m-0">{module.title}</h3>
              {module.updatedAt && (
                <p className="text-sm text-gray-600">
                  Last modified: {new Date(module.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <ModuleButton
                label="Edit"
                onClick={() => setEditModule(module)}
                color="#007bff"
              />
              <ModuleButton
                label="Delete"
                onClick={() => setDeleteConfirmModule(module)}
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
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p>
            Are you sure you want to delete “{deleteConfirmModule.title}”?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => handleDeleteModule(deleteConfirmModule.id)}
              className="bg-red-600 text-white py-2 px-4 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteConfirmModule(null)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
