import React, { useState } from "react";
import api from "../lib/api";

interface CreateModuleProps {
  onModuleCreated?: () => void;
  setCreateModule: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateModule: React.FC<CreateModuleProps> = ({ onModuleCreated, setCreateModule }) => {
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        "/modules",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Module created successfully!");
      setError(null);
      onModuleCreated?.();
    } catch (err: any) {
      setError("Error creating module: " + err.message);
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Module</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter module title"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setCreateModule(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Module
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {success && <div className="text-green-500 mt-4">{success}</div>}
    </div>
  );
};

export default CreateModule;
