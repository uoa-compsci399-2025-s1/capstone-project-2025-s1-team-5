import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

interface S3File {
  key: string;
  url: string;
  lastModified?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const ImageLibraryModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const [files, setFiles] = useState<S3File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      axios.get<S3File[]>(`${API_URL}/api/library`).then(res => setFiles(res.data));
    }
  }, [open]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles(prev => [...prev, { key: res.data.url.split('/').pop(), url: res.data.url }]);
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative">
        <button className="absolute right-4 top-4 text-gray-400" onClick={onClose}>✕</button>
        <h2 className="text-lg font-bold mb-4">Image Library</h2>
        {/* Upload form */}
        <form className="flex gap-2 mb-4" onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            disabled={uploading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            disabled={uploading || !selectedFile}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {files.map(file => (
            <button
              key={file.key}
              type="button"
              onClick={() => onSelect(file.url)}
              className="rounded border hover:border-blue-500 focus:border-blue-600 overflow-hidden"
              title={file.key}
            >
              <img src={file.url} alt={file.key} className="w-full h-24 object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageLibraryModal;
