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

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}`);
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
        <div className="mt-8">
          <EditUserForm
            user={editUser}
            onUserUpdated={fetchUsers}
            setEditUser={setEditUser}
          />
        </div>
      )}

      <div className="mt-12">
        <CreateUser onUserCreated={fetchUsers} />
      </div>
    </div>
  );
};

export default UsersPage;
