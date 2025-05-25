// src/pages/EditModuleForm.tsx
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../lib/api";
import BlockEditorModal from "./BlockEditorModal";

export interface ModuleType {
  id: string;
  title: string;
  subsectionIds: string[];
  quizIds: string[];
  updatedAt: string;
}

interface Subsection {
  _id: string;
  title: string;
  body: string;
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface EditModuleFormProps {
  module: ModuleType;
  onModuleUpdated: () => void;
  setEditModule: React.Dispatch<React.SetStateAction<ModuleType | null>>;
}

// —— 拖拽 + 内联编辑标题 + 打开内容编辑的行组件
function SubItem({
  sub,
  isEditing,
  editingValue,
  onStartEdit,
  onChangeEdit,
  onSaveEdit,
  onEditContent,
}: {
  sub: { id: string; title: string };
  isEditing: boolean;
  editingValue: string;
  onStartEdit: () => void;
  onChangeEdit: (v: string) => void;
  onSaveEdit: () => void;
  onEditContent: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sub.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
        padding: 8,
        border: "1px solid #ddd",
        borderRadius: 4,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* 拖拽把手 */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab px-2 select-none"
      >
        ☰
      </div>
      {/* 双击编辑标题 */}
      <div className="flex-1 px-2">
        {isEditing ? (
          <input
            autoFocus
            value={editingValue}
            onChange={(e) => onChangeEdit(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            className="w-full border-b border-blue-500 focus:outline-none"
          />
        ) : (
          <span
            onDoubleClick={onStartEdit}
            className="cursor-pointer"
          >
            {sub.title}
          </span>
        )}
      </div>
      {/* 打开内容编辑弹窗 */}
      <button
        type="button"
        onClick={onEditContent}
        className="text-sm text-blue-600 hover:underline"
      >
        Edit Content
      </button>
    </div>
  );
}

export default function EditModuleForm({
  module,
  onModuleUpdated,
  setEditModule,
}: EditModuleFormProps) {
  // --- Tab 状态 ---
  const [activeTab, setActiveTab] = useState<"subsections" | "quizzes">(
    "subsections"
  );

  // --- Subsection 相关状态 ---
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [order, setOrder] = useState<string[]>(module.subsectionIds);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<string | null>(null);

  // --- Quiz 相关状态 ---
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<string | null>(null);

  // dnd-kit sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // 拉取所有 Subsections & Quizzes
  useEffect(() => {
    // Subsections
    Promise.all(order.map((id) => api.get(`/modules/subsection/${id}`)))
      .then((res) =>
        setSubsections(res.map((r) => r.data as Subsection))
      )
      .catch(console.error);

    // Quizzes
    if (module.quizIds?.length) {
      Promise.all(
        module.quizIds.map((id) =>
          api.get(`/modules/quiz/${id}`)
        )
      )
        .then((res) =>
          setQuizzes(res.map((r) => r.data as Quiz))
        )
        .catch(console.error);
    }
  }, [order, module.quizIds]);

  // 保存 Drag 排序
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setSubsections((list) => {
      const oldIdx = list.findIndex((s) => s._id === active.id);
      const newIdx = list.findIndex((s) => s._id === over.id);
      const newList = arrayMove(list, oldIdx, newIdx);
      setOrder(newList.map((s) => s._id));
      return newList;
    });
  };

  // 新增 Subsection
  const handleAddSubsection = async () => {
    const res = await api.post(`/modules/${module.id}`, {
      title: "New Subsection",
      body: "<p>Enter content…</p>",
      authorID: "system",
    });
    const newId = res.data._id;
    setOrder((o) => [...o, newId]);
  };

  // 删除 Subsection
  const handleDeleteSubsection = async (id: string) => {
    await api.delete(`/modules/${module.id}/${id}`);
    setOrder((o) => o.filter((x) => x !== id));
    setDeleteConfirmSub(null);
  };

  // 保存某行标题编辑
  const saveSubsectionTitle = async (id: string) => {
    await api.put(`/modules/subsection/${id}`, {
      title: editingTitleValue,
    });
    setSubsections((s) =>
      s.map((x) =>
        x._id === id ? { ...x, title: editingTitleValue } : x
      )
    );
    setEditingTitleId(null);
  };

  // 新增 Quiz
  const handleAddQuiz = async () => {
    const res = await api.post(`/modules/${module.id}/quiz`, {
      title: "New Quiz",
      description: "",
    });
    setQuizzes((q) => [...q, { ...(res.data as Quiz), questions: [] }]);
  };

  // 删除 Quiz
  const handleDeleteQuiz = async (id: string) => {
    await api.delete(`/modules/${module.id}/quiz/${id}`);
    setQuizzes((q) => q.filter((x) => x._id !== id));
    setDeleteConfirmQuiz(null);
  };

  // ---------------------- 提交模块顺序 & quizIds ----------------------
  const handleSaveModule = async () => {
    await api.put(`/modules/${module.id}`, {
      title: module.title, // 标题目前无法修改
      subsectionIds: order,
      quizIds: quizzes.map((q) => q._id),
    });
    onModuleUpdated();
    setEditModule(null);
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Module: {module.title}</h1>

      {/* Tab 切换 */}
      <div className="flex border-b mb-6">
        {["subsections", "quizzes"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === tab
                ? "font-semibold border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab === "subsections" ? "Subsections" : "Quizzes"}
          </div>
        ))}
      </div>

      {/* Subsections Tab */}
      {activeTab === "subsections" && (
        <div className="mb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={subsections.map((s) => s._id)}
              strategy={verticalListSortingStrategy}
            >
              {subsections.map((sub) => (
                <SubItem
                  key={sub._id}
                  sub={{ id: sub._id, title: sub.title }}
                  isEditing={editingTitleId === sub._id}
                  editingValue={editingTitleValue}
                  onStartEdit={() => {
                    setEditingTitleId(sub._id);
                    setEditingTitleValue(sub.title);
                  }}
                  onChangeEdit={setEditingTitleValue}
                  onSaveEdit={() => saveSubsectionTitle(sub._id)}
                  onEditContent={() => setEditingSubId(sub._id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddSubsection}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              + Add Subsection
            </button>
            {editingTitleId === null && (
              <button
                onClick={() => editingSubId && setDeleteConfirmSub(editingSubId)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Selected
              </button>
            )}
            <button
              onClick={handleSaveModule}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Module
            </button>
          </div>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="mb-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="border p-4 rounded mb-4">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) =>
                    setQuizzes((qs) =>
                      qs.map((q) =>
                        q._id === quiz._id ? { ...q, title: e.target.value } : q
                      )
                    )
                  }
                  className="text-lg font-semibold flex-1 border-b"
                />
                <button
                  onClick={() => setDeleteConfirmQuiz(quiz._id)}
                  className="ml-4 text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              <textarea
                value={quiz.description}
                onChange={(e) =>
                  setQuizzes((qs) =>
                    qs.map((q) =>
                      q._id === quiz._id
                        ? { ...q, description: e.target.value }
                        : q
                    )
                  )
                }
                className="w-full border rounded p-2 mb-2"
                placeholder="Quiz description"
              />
              {/* Questions 列表略…(同主干逻辑) */}
              <button
                onClick={handleAddQuiz}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
              >
                + Add Quiz
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subsection 内容编辑弹窗 */}
      {editingSubId && (
        <BlockEditorModal
          subsectionId={editingSubId}
          initialTitle={
            subsections.find((s) => s._id === editingSubId)!.title
          }
          onTitleChange={(newT) =>
            setSubsections((s) =>
              s.map((x) =>
                x._id === editingSubId ? { ...x, title: newT } : x
              )
            )
          }
          onLayoutChange={() => setOrder([...order]) /* 重新拉取 */}
          onClose={() => setEditingSubId(null)}
        />
      )}

      {/* 删除确认模态框 */}
      {deleteConfirmSub && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <p>Delete this subsection?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleDeleteSubsection(deleteConfirmSub)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteConfirmSub(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <p>Delete this quiz and its questions?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleDeleteQuiz(deleteConfirmQuiz)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteConfirmQuiz(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
