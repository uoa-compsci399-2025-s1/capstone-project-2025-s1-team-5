import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// 1. Use your absolute API URL from env or fallback
const API_URL = process.env.REACT_APP_API_URL || "http://3.107.214.51:3000";

interface S3File {
  key: string;
  url: string;
}

const UploadLibrary: React.FC = () => {
  const [files, setFiles] = useState<S3File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch files from API
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get<S3File[]>(`${API_URL}/api/library`);
      setFiles(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, []);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files ? e.target.files[0] : null);
    setError(null);
  };

  // Handle upload
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return setError("Please select a file to upload.");
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSelectedFile(null);
      await fetchFiles(); // Refresh images
    } catch {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-white to-blue-100 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Upload Library</h1>
        {/* Upload Form */}
        <form
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
          onSubmit={handleUpload}
        >
          <input
            type="file"
            accept="image/*"
            className="border rounded p-2"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2 font-medium transition disabled:bg-blue-200"
            disabled={uploading || !selectedFile}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {/* Image Grid */}
        {loading ? (
          <div className="text-center py-8">Loading images...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No images found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.key}
                className="rounded-lg overflow-hidden border bg-gray-50 hover:shadow-lg flex flex-col"
              >
                <img
                  src={file.url}
                  alt={file.key}
                  className="object-cover w-full h-36"
                />
                <div className="truncate text-xs p-2 text-center text-gray-700">
                  {file.key}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadLibrary;
