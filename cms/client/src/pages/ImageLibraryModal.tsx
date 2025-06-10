import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

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

  useEffect(() => {
    if (open) {
      axios.get<S3File[]>(`${API_URL}/api/library`).then(res => setFiles(res.data));
    }
  }, [open]);


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    handleUpload(file);
  }
};


const handleUpload = async (file: File) => {
  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const res = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setFiles(prev => [...prev, { key: res.data.url.split('/').pop(), url: res.data.url }]);
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setUploading(false);
  }
};

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="absolute right-4 top-4 text-gray-400" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Image Library</h2>
        <div className="flex gap-2 mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              id="file-upload"
              className="hidden"
            />
            <label 
              htmlFor="file-upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded cursor-pointer"
            >
              {uploading ? "Uploading..." : "Select & Upload"}
            </label>
          </div>
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          onClick={e => e.stopPropagation()}
        >
          {files.map(file => (
            <button
              key={file.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(file.url);
              }}
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