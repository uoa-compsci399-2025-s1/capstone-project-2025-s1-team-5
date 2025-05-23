import React, { useEffect, useState } from "react";
import CreateUser from "../pages/CreateUser";
import axios from "axios";
import EditUserForm from "./EditUser";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  programme?: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); //transition
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); //transition
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
      params: { limit, page },
    });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total / limit)); // 👈 Here’s the important part
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
  fetchUsers();
}, [page]);


  const sortUsers = (data: User[]) => {
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

  const handleSort = (key: keyof User) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  return (
    
    <div className="p-6 border-neutral-950 bg-white shadow-orange-600 bg-clip-padding" style={{ paddingLeft: '60px' }}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

      <input
        type="text"
        placeholder="Search users by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full max-w-md shadow-sm"
      />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                ["first_name", "Name"],
                ["email", "Email"],
                ["country", "Country"],
                ["programme", "Programme"],
                ["role", "Role"],
                ["createdAt", "Date Created"],
              ].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof User)}
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
            {sortUsers(
              users.filter((user) =>
                `${user.first_name} ${user.last_name} ${user.email} ${user.country}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
            ).map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{user.first_name} {user.last_name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.country}</td>
                <td className="py-2 px-4">{user.programme || "N/A"}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            className={`bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative transform transition-all duration-300 ${
              isEditModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4"></h2>
            <button
              onClick={() => {
                setIsEditModalVisible(false);
                setTimeout(() => setEditUser(null), 300);
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <EditUserForm
              user={editUser}
              onUserUpdated={() => {
                fetchUsers();
                setIsEditModalVisible(false);
                setTimeout(() => setEditUser(null), 300);
              }}
              setEditUser={setEditUser}
            />
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 self-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="mt-12">
        {!showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              setIsCreateModalVisible(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Create New User
          </button>
        )}

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div
              className={`bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative transform transition-all duration-300 ${
                isCreateModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4"></h2>
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

              <CreateUser
                onUserCreated={() => {
                  fetchUsers();
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

export default UsersPage;
