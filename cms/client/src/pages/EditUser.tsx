// EditUserForm.tsx
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
  user: User;                // The user being edited
  onUserUpdated: () => void; // Function to call when user is updated
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>; // Function to reset the editUser state
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUserUpdated, setEditUser }) => {
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [country, setCountry] = useState(user.country);
  const [programme, setProgramme] = useState(user.programme || "");
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedUser = {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password,
        "country": country,
        "programme": programme,
      };

    try {
      await axios.put(`http://localhost:3000/users/${user.id}`, updatedUser);
      onUserUpdated(); // Refresh the list of users
      setEditUser(null); // Close the edit form
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Programme:</label>
          <input
            type="text"
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
          />
        </div>
        <button type="submit">Update User</button>
      </form>
      <button onClick={() => setEditUser(null)}>Cancel</button>
    </div>
  );
};

export default EditUserForm;
