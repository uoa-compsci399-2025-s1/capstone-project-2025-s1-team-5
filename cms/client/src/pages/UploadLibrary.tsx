import React, { useEffect, useState, ChangeEvent, FormEvent, useRef, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

interface S3File {
  key: string;
  url: string;
  lastModified?: string;
}

interface Point {
  x: number;
  y: number;
}

type SortBy = "title-asc" | "title-desc" | "date-asc" | "date-desc";

const UploadLibrary: React.FC = () => {
  const [files, setFiles] = useState<S3File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragRect, setDragRect] = useState<null | { left: number; top: number; width: number; height: number }>(null);
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");

  
  const gridRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Array<HTMLDivElement | null>>([]);


   const sortedFiles = [...files].sort((a, b) => {
    if (sortBy === "title-asc") {
      return (a.key || "").localeCompare(b.key || "");
    }
    if (sortBy === "title-desc") {
      return (b.key || "").localeCompare(a.key || "");
    }
    if (sortBy === "date-asc") {
      return new Date(a.lastModified || 0).getTime() - new Date(b.lastModified || 0).getTime();
    }
    return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime();
  });

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get<S3File[]>(`${API_URL}/api/library`);

      setFiles(res.data);
      setSelectedKeys(new Set());
      setError(null);
    } catch (err) {
      setError("Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files ? e.target.files[0] : null);
    setError(null);
  };


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
      await fetchFiles();
    } catch {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };


  const handleSelect = (key: string) => {
    setSelectedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleDelete = async () => {
    if (selectedKeys.size === 0) return;
    setError(null);
    try {
      await Promise.all(
        Array.from(selectedKeys).map(key =>
          axios.delete(`${API_URL}/api/library/${encodeURIComponent(key)}`)
        )
      );
      setSelectedKeys(new Set());
      await fetchFiles();
    } catch {
      setError("Failed to delete selected images.");
    }
  };

  const allSelected = files.length > 0 && selectedKeys.size === files.length;
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(files.map(file => file.key)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (e.target !== gridRef.current) return; 
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragRect(null);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
  if (!dragStart) return;
  const x = Math.min(e.clientX, dragStart.x);
  const y = Math.min(e.clientY, dragStart.y);
  const width = Math.abs(e.clientX - dragStart.x);
  const height = Math.abs(e.clientY - dragStart.y);
  setDragRect({ left: x, top: y, width, height });
}, [dragStart]);

const handleMouseUp = useCallback((e: MouseEvent) => {
  if (!dragStart || !dragRect) {
    setDragStart(null);
    setDragRect(null);
    return;
  }
  const rect = dragRect;
  const gridOffset = gridRef.current?.getBoundingClientRect();
  if (!gridOffset) return;

  const selected = new Set(selectedKeys);
  files.forEach((file, idx) => {
    const box = boxRefs.current[idx];
    if (!box) return;
    const boxRect = box.getBoundingClientRect();
    if (
      boxRect.left < rect.left + rect.width &&
      boxRect.left + boxRect.width > rect.left &&
      boxRect.top < rect.top + rect.height &&
      boxRect.top + boxRect.height > rect.top
    ) {
      selected.add(file.key);
    }
  });
  setSelectedKeys(selected);
  setDragStart(null);
  setDragRect(null);
}, [dragStart, dragRect, selectedKeys, files]);


  useEffect(() => {
    if (dragStart) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
      };
    }

  }, [dragStart, dragRect, handleMouseMove, handleMouseUp]);


    boxRefs.current = sortedFiles.map((_, i) => boxRefs.current[i] || null);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-white to-blue-100 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Upload Library</h1>
        
        
        
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
        
        <div className="flex justify-between items-center mb-4">
          <button
            className={`bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 font-medium transition disabled:bg-red-200 ${
              selectedKeys.size === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedKeys.size === 0}
            onClick={handleDelete}
          >
            Delete Selected
          </button>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              <span className="text-sm">Select All</span>
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2 my-4">
          <label className="text-sm font-medium text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="border rounded p-1 text-sm"
          >
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 relative"
          style={{ minHeight: "200px", userSelect: dragStart ? "none" : "auto" }}
          onMouseDown={handleMouseDown}
        >
          {loading ? (
            <div className="col-span-full text-center py-8">Loading images...</div>
            ) : sortedFiles.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">No images found.</div>
            ) : (
            sortedFiles.map((file, idx) => (
                <div
                key={file.key}
                ref={el => { boxRefs.current[idx] = el; }}
                className={`relative rounded-lg overflow-hidden border bg-gray-50 hover:shadow-lg flex flex-col cursor-pointer ring-2 ${
                    selectedKeys.has(file.key)
                    ? "ring-blue-500 border-blue-500"
                    : "ring-transparent"
                }`}
                tabIndex={0}
                onClick={e => {
                    if ((e.target as HTMLElement).tagName === "INPUT") return;
                    handleSelect(file.key);
                }}
                >
                <input
                    type="checkbox"
                    className="absolute top-2 left-2 z-10 w-4 h-4 cursor-pointer"
                    checked={selectedKeys.has(file.key)}
                    onChange={() => handleSelect(file.key)}
                    tabIndex={-1}
                    aria-label="Select"
                />
                <img
                    src={file.url}
                    alt={file.key}
                    className="object-cover w-full h-36"
                    draggable={false}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                />
                <div className="truncate text-xs p-2 text-center text-gray-700">
                    {file.key}
                    {file.lastModified && (
                    <div className="text-[10px] text-gray-400">{new Date(file.lastModified).toLocaleString()}</div>
                    )}
                </div>
                </div>
            ))
        )}  
          {dragRect && (
            <div
              className="absolute bg-blue-400 bg-opacity-20 border-2 border-blue-400 pointer-events-none"
              style={{
                left: dragRect.left - (gridRef.current?.getBoundingClientRect().left || 0),
                top: dragRect.top - (gridRef.current?.getBoundingClientRect().top || 0),
                width: dragRect.width,
                height: dragRect.height,
                zIndex: 30,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadLibrary;
