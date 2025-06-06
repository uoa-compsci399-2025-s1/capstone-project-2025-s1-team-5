import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import axios from "axios";
import { Module } from "../types/interfaces";

interface ModulesOrderProps {
  modules: Module[];
  onClose: () => void;
  onOrderChanged: () => void;
}

const ModulesOrder: React.FC<ModulesOrderProps> = ({
  modules,
  onClose,
  onOrderChanged,
}) => {
  const [localModules, setLocalModules] = useState<Module[]>([...modules]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const reorderArray = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const reordered = reorderArray(localModules, result.source.index, result.destination.index);
    setLocalModules(reordered);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const orderedIds = localModules.map((m) => m._id || m.id || "");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/modules/reorder`,
        { orderedModuleIds: orderedIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") ?? ""}`,
          },
        }
      );
      onOrderChanged();
      onClose();
    } catch (err) {
      console.error("Failed to save module order:", err);
      setError("Failed to save new order. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reorder Modules</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules-list">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 mb-6"
              >
                {localModules.map((module, index) => (
                  <Draggable
                    key={module._id || module.id}
                    draggableId={module._id || module.id!}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          flex items-center bg-white border border-gray-200 
                          rounded-md p-3 
                          transition-shadow transition-bg duration-150
                          ${snapshot.isDragging ? "bg-blue-50 shadow-lg" : "hover:shadow-md"}
                        `}
                      >
                        <span className="cursor-grab mr-3 text-gray-400">☰</span>
                        <span className="flex-1 text-gray-700">{module.title}</span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${isSaving
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"}
              transition-colors duration-150
            `}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${
                isSaving
                  ? "bg-green-200 text-green-700 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }
              transition-colors duration-150
            `}
          >
            {isSaving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulesOrder;
