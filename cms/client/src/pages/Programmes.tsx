import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProgrammeForm from "./EditProgramme";
import CreateProgrammeForm from "./CreateProgramme";
import { Programme } from "../types/interfaces"

const ProgrammesPage = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Programme | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editProgramme, setEditProgramme] = useState<Programme | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  
  const fetchProgrammes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/programmes`);
      setProgrammes(res.data || []);
    } catch (error) {
      console.error("Failed to fetch programmes:", error);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const sortProgrammes = (data: Programme[]) => {
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

  const handleSort = (key: keyof Programme) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleEdit = (programme: Programme) => {
    setEditProgramme(programme);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (programmeId: string) => {
        const token = localStorage.getItem("authToken");

    if (window.confirm("Are you sure you want to delete this programme?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/programmes/${programmeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchProgrammes();
      } catch (error) {
        console.error("Failed to delete programme:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md" style={{ paddingLeft: '60px' }}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Programmes</h1>

      <input
        type="text"
        placeholder="Search programmes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full max-w-md shadow-sm"
      />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Programmes</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[["name", "Name"], ["description", "Description"], ["link", "Link"]].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof Programme)}
                  className="py-3 px-4 text-left font-semibold text-gray-700 cursor-pointer select-none"
                >
                  {label}{" "}
                  {sortKey === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortProgrammes(
              programmes.filter((p) =>
                `${p.name} ${p.description}`.toLowerCase().includes(searchTerm.toLowerCase())
              )
            ).map((programme) => (
              <tr key={programme._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{programme.name}</td>
                <td className="py-2 px-4">{programme.description}</td>
                <td className="py-2 px-4">{programme.link}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(programme)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(programme._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editProgramme && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            className={`bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative transform transition-all duration-300 ${
              isEditModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button
              onClick={() => {
                setIsEditModalVisible(false);
                setTimeout(() => setEditProgramme(null), 300);
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <EditProgrammeForm
              programme={editProgramme}
              setEditProgramme={setEditProgramme}
              onProgrammeUpdated={() => {
                fetchProgrammes();
                setIsEditModalVisible(false);
                setTimeout(() => setEditProgramme(null), 300);
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-12">
        {!showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              setIsCreateModalVisible(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Create New Programme
          </button>
        )}

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div
              className={`bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative transform transition-all duration-300 ${
                isCreateModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <button
                onClick={() => {
                  setIsCreateModalVisible(false);
                  setTimeout(() => setShowCreateForm(false), 300);
                }}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <CreateProgrammeForm
                onProgrammeCreated={() => {
                  fetchProgrammes();
                  setIsCreateModalVisible(false);
                  setTimeout(() => setShowCreateForm(false), 300);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgrammesPage;
