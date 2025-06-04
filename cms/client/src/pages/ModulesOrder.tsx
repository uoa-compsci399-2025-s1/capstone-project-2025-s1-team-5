// src/pages/modulesorder.tsx

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import axios from "axios";
import ModuleButton from "../components/ModuleButton";
import { Module } from "../types/interfaces";

interface ModulesOrderProps {
  /**
   * The list of modules to display (in their current order).
   */
  modules: Module[];
  /**
   * Called to close the overlay (e.g. when user clicks “Cancel” or after saving).
   */
  onClose: () => void;
  /**
   * Called after successfully saving the new order, so the parent can re-fetch.
   */
  onOrderChanged: () => void;
}

const ModulesOrder: React.FC<ModulesOrderProps> = ({
  modules,
  onClose,
  onOrderChanged,
}) => {
  // Make a local copy of the modules array so we can reorder it in state.
  const [localModules, setLocalModules] = useState<Module[]>([...modules]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /**
   * Utility: reorder an array by moving the item at `startIndex` to `endIndex`.
   */
  const reorderArray = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  /**
   * Called by DragDropContext after a drag ends.
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      // Dropped outside any droppable area
      return;
    }

    // If the item was dropped in the same position, do nothing
    if (result.destination.index === result.source.index) {
      return;
    }

    // Create a new array with the item moved to its destination
    const reordered = reorderArray(localModules, result.source.index, result.destination.index);
    setLocalModules(reordered);
  };

  /**
   * Send the updated order of module IDs to the backend.
   * Adjust the endpoint and payload to match your API.
   */
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const orderedIds = localModules.map((m) => m._id || m.id || "");

      // Example API call: PUT /api/modules/reorder
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/modules/reorder`,
        { orderedModuleIds: orderedIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") ?? ""}`,
          },
        }
      );

      // Once saved, inform parent to re-fetch modules, then close
      onOrderChanged();
      onClose();
    } catch (err) {
      console.error("Failed to save module order:", err);
      setError("Failed to save new order. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Reorder Modules</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
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
                        className={`flex items-center justify-between bg-gray-50 rounded p-3 shadow-sm ${
                          snapshot.isDragging ? "bg-blue-100" : ""
                        }`}
                      >
                        <span className="flex-1">
                          {module.title}
                        </span>
                        {/* 
                          You could add a drag handle icon here if you like, for example: 
                          <span {...provided.dragHandleProps} className="cursor-grab mr-2">☰</span>
                        */}
                      </li>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end space-x-4">
          <ModuleButton
            label="Cancel"
            onClick={onClose}
            color="#6c757d" // gray
          />
          <ModuleButton
            label={isSaving ? "Saving..." : "Save Order"}
            onClick={handleSave}
            color="#28a745" // green
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulesOrder;
export {};
