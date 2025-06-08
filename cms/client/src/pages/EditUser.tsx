
import React, { useState } from "react";
import axios from "axios";

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

interface EditUserFormProps {
  user: User;           
  onUserUpdated: () => void; 
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUserUpdated, setEditUser }) => {
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(user.country);
  const [programme, setProgramme] = useState(user.programme || "");
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedUser = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password,
        "country": country,
        "programme": programme,
        "role": role,
      };

    try {
      const token = localStorage.getItem("authToken")
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, updatedUser,         { headers: { Authorization: `Bearer ${token}` } }
);
      onUserUpdated();
      setEditUser(null);
      setSuccess("User successfully edited")
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Failed to edit user")
    }
  };


 return (
    <div className="mt-10 bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Programme</label>
          <input
            type="text"
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
             
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
          <option value="">Select a Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-400 transition"
          >
            Edit User
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {setEditUser(null)}}
            className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-400 transition"
          >
            Cancel
          </button>
        </div>  
      </form>

      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
      {success && <div className="mt-4 text-green-600 font-medium">{success}</div>}
    </div>
  );
};

export default EditUserForm;
