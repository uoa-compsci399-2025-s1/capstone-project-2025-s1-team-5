import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateUser from "../pages/CreateUser";
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

const UsersPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState<number>(1);


  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users`,
        {

          params: { limit: 99999, page: 1 },
          headers: { Accept: "application/json" },
        }
      );

      const data = response.data;
      setAllUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    }
  };


  useEffect(() => {
    fetchAllUsers();
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
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };


  useEffect(() => {
    const filtered = allUsers.filter((user) => {
      const combinedFields =
        `${user.first_name} ${user.last_name} ${user.email} ${user.country}`.toLowerCase();
      return combinedFields.includes(searchTerm.toLowerCase());
    });

    const newTotalPages = Math.ceil(filtered.length / perPage) || 1;
    setTotalPages(newTotalPages);

    if (page > newTotalPages) {
      setPage(1);
    }
  }, [allUsers, searchTerm, perPage, page]);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
          const token = localStorage.getItem("authToken");

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }
          
        );
        fetchAllUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };


  const filteredUsers = allUsers.filter((user) => {
    const combinedFields =
      `${user.first_name} ${user.last_name} ${user.email} ${user.country}`.toLowerCase();
    return combinedFields.includes(searchTerm.toLowerCase());
  });
  const sortedUsers = sortUsers(filteredUsers);
  const pagedUsers = sortedUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );


  return (
    <div className="p-6 bg-white shadow-lg" style={{ paddingLeft: "60px" }}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

      <input
        type="text"
        placeholder="Search across all users, email or country..."
        value={searchTerm}
        onChange={(e) => {
          setPage(1);          
          setSearchTerm(e.target.value);
        }}
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
                  {sortKey === key
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
              ))}
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.country}</td>
                <td className="py-2 px-4">{user.programme || "N/A"}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <div className="flex space-x-2">
                  <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs sm:text-sm whitespace-nowrap flex-1 min-w-[10px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs sm:text-sm whitespace-nowrap flex-1 min-w-[10px]"
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

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, totalPages))
          }
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
                isCreateModalVisible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
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

              <CreateUser
                onUserCreated={() => {
                  fetchAllUsers();
                  setPage(1);
                  setIsCreateModalVisible(false);
                  setTimeout(() => setShowCreateForm(false), 300);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {editUser && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            className={`bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative transform transition-all duration-300 ${
              isEditModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
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
                fetchAllUsers();
                setIsEditModalVisible(false);
                setTimeout(() => setEditUser(null), 300);
              }}
              setEditUser={setEditUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
