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
import BlockEditorModal from "./BlockEditorModal"; // 你之前的弹窗组件

// 导出给 Modules.tsx 用
export interface ModuleType {
  id: string;
  title: string;
  subsectionIds: string[];
  updatedAt: string;
}

interface EditModuleFormProps {
  module: ModuleType;
  onModuleUpdated: () => void;
  setEditModule: React.Dispatch<React.SetStateAction<ModuleType | null>>;
}

// 单条子节行组件，Hook 在这里顶层调用
function SubItem({
  sub,
  editingTitleId,
  editingTitleValue,
  onTitleDoubleClick,
  onTitleChange,
  onTitleSave,
  onContentEdit,
}: {
  sub: { id: string; title: string };
  editingTitleId: string | null;
  editingTitleValue: string;
  onTitleDoubleClick: () => void;
  onTitleChange: (val: string) => void;
  onTitleSave: () => void;
  onContentEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sub.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        margin: "6px 0",
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 4,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* 拖拽把手 */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", padding: "0 8px", userSelect: "none" }}
      >
        ☰
      </div>

      {/* 双击可编辑标题 */}
      <div style={{ flex: 1, paddingLeft: 8 }}>
        {editingTitleId === sub.id ? (
          <input
            autoFocus
            value={editingTitleValue}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleSave}
            onKeyDown={(e) => e.key === "Enter" && onTitleSave()}
            style={{ width: "100%", padding: 4, fontSize: "1rem" }}
          />
        ) : (
          <span
            onDoubleClick={onTitleDoubleClick}
            style={{ cursor: "pointer" }}
          >
            {sub.title}
          </span>
        )}
      </div>

      {/* 编辑内容 */}
      <button type="button" onClick={onContentEdit}>
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
  // 模块标题
  const [title, setTitle] = useState(module.title);
  // 子节简单信息
  const [subsections, setSubsections] = useState<{ id: string; title: string }[]>([]);
  // 排序数组
  const [order, setOrder] = useState<string[]>(module.subsectionIds);

  // 标题编辑
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>("");

  // 弹窗子节 ID
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  // dnd-kit
  const sensors = useSensors(useSensor(PointerSensor));

  // 拉取子节标题
  useEffect(() => {
    Promise.all(order.map((id) => api.get(`/modules/subsection/${id}`)))
      .then((resList) =>
        setSubsections(
          resList.map((r) => ({ id: r.data._id, title: r.data.title }))
        )
      )
      .catch(console.error);
  }, [order]);

  // 保存某个子节标题
  const saveSubsectionTitle = async (id: string) => {
    try {
      await api.put(`/modules/subsection/${id}`, {
        title: editingTitleValue,
      });
      setSubsections((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, title: editingTitleValue } : s
        )
      );
    } catch {
      alert("保存标题失败");
    } finally {
      setEditingTitleId(null);
    }
  };

  // 拖拽结束
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setSubsections((list) => {
      const oldIdx = list.findIndex((s) => s.id === active.id);
      const newIdx = list.findIndex((s) => s.id === over.id);
      const newList = arrayMove(list, oldIdx, newIdx);
      setOrder(newList.map((s) => s.id));
      return newList;
    });
  };

  // 新增子节
  const handleAddSubsection = async () => {
    try {
      const res = await api.post(`/modules/${module.id}`, {
        title: "New Subsection",
        body: "<p>Enter content...</p>",
        authorID: "system",
      });
      setOrder((prev) => [...prev, res.data._id]);
    } catch {
      alert("添加子节失败");
    }
  };

  // 提交模块更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/modules/${module.id}`, {
        title,
        subsectionIds: order,
      });
      onModuleUpdated();
      setEditModule(null);
    } catch {
      alert("更新模块失败");
    }
  };

  const fetchSubsections = async (order: string[]) => {
    try {
      const resList = await Promise.all(
        order.map((id) => api.get(`/modules/subsection/${id}`))
      );
      setSubsections(
        resList.map((r) => ({ id: r.data._id, title: r.data.title }))
      );
    } catch (err) {
      console.error("拉取子节失败", err);
    }
  };

  useEffect(() => {
    // 初始或 order 改变时拉一次
    fetchSubsections(order);
  }, [order]);
  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ padding: 20, width: 600, maxWidth: "90vw" }}
      >
        <h2>Edit Module</h2>
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />

        <h3>Subsections (drag to reorder)</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={subsections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {subsections.map((sub) => (
              <SubItem
                key={sub.id}
                sub={sub}
                editingTitleId={editingTitleId}
                editingTitleValue={editingTitleValue}
                onTitleDoubleClick={() => {
                  setEditingTitleId(sub.id);
                  setEditingTitleValue(sub.title);
                }}
                onTitleChange={setEditingTitleValue}
                onTitleSave={() => saveSubsectionTitle(sub.id)}
                onContentEdit={() => setEditingSubId(sub.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          type="button"
          onClick={handleAddSubsection}
          style={{ marginTop: 12 }}
        >
          + Add Subsection
        </button>

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button type="submit">Update Module</button>
          <button
            type="button"
            onClick={() => setEditModule(null)}
            style={{ marginLeft: 8 }}
          >
            Close
          </button>
        </div>
      </form>

      {/* 子节内容 & 布局编辑弹窗 */}
      {editingSubId && (
        <BlockEditorModal
          subsectionId={editingSubId}
          initialTitle={subsections.find((x) => x.id === editingSubId)!.title}
          onTitleChange={(newT) =>
            setSubsections((list) =>
              list.map((x) =>
                x.id === editingSubId ? { ...x, title: newT } : x
              )
            )
          }
          onLayoutChange={(newLayout) => {fetchSubsections(order)}}
          onClose={() => setEditingSubId(null)}
        />
      )}
    </>
  );
}
