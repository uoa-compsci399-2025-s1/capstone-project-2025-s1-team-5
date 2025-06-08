import React, { useState } from "react";
import axios from "axios";
import { Programme } from "../types/interfaces"


interface EditProgrammeFormProps {
  programme: Programme;
  onProgrammeUpdated: () => void;
  setEditProgramme: React.Dispatch<React.SetStateAction<Programme | null>>;
}

const EditProgrammeForm: React.FC<EditProgrammeFormProps> = ({
  programme,
  onProgrammeUpdated,
  setEditProgramme,
}) => {
  const [name, setName] = useState(programme.name);
  const [description, setDescription] = useState(programme.description);
  const [link, setLink] = useState(programme.link); 
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken")
      await axios.put(
        
        `${process.env.REACT_APP_API_URL}/api/programmes/${programme._id}`,
        { name, description, link }, 
                { headers: { Authorization: `Bearer ${token}` } }

      );
      onProgrammeUpdated();
    } catch (err) {
      setError("Failed to update programme.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Edit Programme</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Programme Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Link</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setEditProgramme(null)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProgrammeForm;
