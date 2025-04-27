import React, { useEffect, useState } from "react";
import CreateUser from "../pages/CreateUser";
import axios from "axios";
import EditUserForm from "./EditUser";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password:string;
  country: string;
  programme?: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editUser, setEditUser] = useState<User | null>(null);

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
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };
  

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Manage Users</h1>
      <input
      type="text"
      placeholder="Search users by name:"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
      />



      <h2 style={{ marginTop: "2rem" }}>All Users</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th onClick={() => handleSort("first_name")} style={{ cursor: "pointer" , userSelect: "none" }}>
              Name {sortKey === "first_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("email")} style={{ cursor: "pointer" , userSelect: "none" }}>
              Email {sortKey === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("country")} style={{ cursor: "pointer", userSelect: "none"  }}>
              Country {sortKey === "country" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("programme")} style={{ cursor: "pointer" , userSelect: "none" }}>
              Programme {sortKey === "programme" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("role")} style={{ cursor: "pointer", userSelect: "none"  }}>
              Role {sortKey === "role" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" , userSelect: "none" }}>
              Date Created {sortKey === "createdAt" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" , userSelect: "none" }}>
              User ID {sortKey === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>Actions</th>
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
          <tr key={user.id}>
            <td>{user.first_name} {user.last_name}</td>
            <td>{user.email}</td>
            <td>{user.country}</td>
            <td>{user.programme || "N/A"}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>{user.id}</td>
            <td>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))}


        </tbody>
      </table>

            {/* Pass the editUser state and setEditUser function as props to EditUserForm */}
            {editUser && (
              <EditUserForm 
                user={editUser} 
                onUserUpdated={fetchUsers} 
                setEditUser={setEditUser}  // This line is passing the setEditUser function as a prop
              />
            )}
            {/* Create form, passing a callback to refresh users on submit */}
            <CreateUser onUserCreated={fetchUsers} />
    </div>
  );
};

export default UsersPage;
