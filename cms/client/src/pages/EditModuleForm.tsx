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
import LayoutEditor from "../components/LayoutEditor";
import api from "../lib/api";

interface Subsection {
  id: string;
  title: string;
  body: string;
}

interface Module {
  id: string;
  title: string;
  subsectionIds: string[];
  updatedAt: string;
}

interface Props {
  module: Module;
  onModuleUpdated: () => void;
  setEditModule: React.Dispatch<React.SetStateAction<Module | null>>;
}

export default function EditModuleForm({
  module,
  onModuleUpdated,
  setEditModule,
}: Props) {
  // —— 基本信息
  const [title, setTitle] = useState(module.title);

  // —— 子节数据 & 顺序
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [subOrder, setSubOrder] = useState<string[]>(module.subsectionIds);

  // —— 当前打开布局编辑的子节 ID
  const [editingLayoutFor, setEditingLayoutFor] = useState<string | null>(null);

  // —— 双击编辑标题的状态
  const [titleEditId, setTitleEditId] = useState<string | null>(null);
  const [titleEditValue, setTitleEditValue] = useState<string>("");

  // dnd-kit 需要的 sensor
  const sensors = useSensors(useSensor(PointerSensor));

  // 拉取子节详情
  const fetchSubsections = async (order: string[]) => {
    try {
      const resList = await Promise.all(
        order.map((id) => api.get(`/modules/subsection/${id}`))
      );
      setSubsections(
        resList.map((r) => ({
          id: r.data._id,
          title: r.data.title,
          body: r.data.body,
        }))
      );
    } catch (err) {
      console.error("拉取子节失败", err);
    }
  };

  // 初始加载 & subOrder 变化时重新拉
  useEffect(() => {
    fetchSubsections(subOrder);
  }, [subOrder]);

  // 拖拽排序结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSubsections((prev) => {
      const oldIdx = prev.findIndex((s) => s.id === active.id);
      const newIdx = prev.findIndex((s) => s.id === over.id);
      const newArr = arrayMove(prev, oldIdx, newIdx);
      setSubOrder(newArr.map((s) => s.id));
      return newArr;
    });
  };

  // 新增子节
  const handleAddSubsection = async () => {
    try {
      const res = await api.post(`/modules/${module.id}`, {
        title: "New Subsection",
        body: "<p>Enter content here...</p>",
        authorID: "system",
      });
      const newId = res.data._id;
      setSubOrder((prev) => [...prev, newId]);
    } catch (err) {
      console.error("添加子节失败", err);
      alert("添加失败");
    }
  };

  // 保存子节标题
  const saveSubsectionTitle = async (id: string) => {
    try {
      await api.put(`/modules/subsection/${id}`, { title: titleEditValue });
      setSubsections((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, title: titleEditValue } : s
        )
      );
    } catch (err) {
      console.error("更新小节标题失败", err);
      alert("标题保存失败");
    } finally {
      setTitleEditId(null);
    }
  };

  // 提交模块基本信息 + 顺序
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/modules/${module.id}`, {
        title,
        subsectionIds: subOrder,
      });
      onModuleUpdated();
      setEditModule(null);
    } catch (err) {
      console.error("更新模块失败", err);
      alert("更新失败");
    }
  };

  // —— 把 SubsectionItem 定义在这里，闭包可以访问上面所有 state & handler
  function SubsectionItem({
    sub,
    onEditLayout,
  }: {
    sub: Subsection;
    onEditLayout: () => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: sub.id });

    return (
      <div
        ref={setNodeRef}
        style={{
          display: "flex",
          alignItems: "center",
          padding: 8,
          margin: "6px 0",
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
          style={{ cursor: "grab", padding: "0 8px", userSelect: "none",}}>☰</div>

        {/* 可双击编辑的标题 */}
        <div style={{ flex: 1 }}>
          {titleEditId === sub.id ? (
            <input
              autoFocus
              value={titleEditValue}
              onChange={(e) => setTitleEditValue(e.target.value)}
              onBlur={() => saveSubsectionTitle(sub.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveSubsectionTitle(sub.id);
              }}
              style={{ width: "100%", padding: 4, fontSize: "1rem" }}
            />
          ) : (
            <span
              onDoubleClick={() => {
                setTitleEditId(sub.id);
                setTitleEditValue(sub.title);
              }}
              style={{ cursor: "pointer" }}
            >
              {sub.title}
            </span>
          )}
        </div>

        {/* 编辑内容按钮 */}
        <button type="button" onClick={onEditLayout}>
          Edit Content
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      {/* 模块基本信息 */}
      <h1>Edit Module</h1>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12 }}
      />

      {/* 子节列表 & 拖拽排序 */}
      <h2>Subsections (drag to reorder)</h2>
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
            <SubsectionItem
              key={sub.id}
              sub={sub}
              onEditLayout={() =>
                setEditingLayoutFor((prev) => (prev === sub.id ? null : sub.id))
              }
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={handleAddSubsection}
        style={{ marginTop: 12 }}
      >
        Add Subsection
      </button>

      {/* 提交 & 关闭 */}
      <div style={{ marginTop: 24 }}>
        <button type="submit">Update Module</button>
        <button
          type="button"
          onClick={() => setEditModule(null)}
          style={{ marginLeft: 12 }}
        >
          Close
        </button>
      </div>

      {/* 弹窗：布局编辑 */}
      {editingLayoutFor && (
        <BlockEditorModal
          subsectionId={editingLayoutFor}
          onClose={() => setEditingLayoutFor(null)}
        />
      )}
    </form>
  );
}

// —— 弹窗：区块布局编辑器
function BlockEditorModal({
  subsectionId,
  onClose,
}: {
  subsectionId: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 700,
          maxHeight: "85%",
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 8,
          overflowY: "auto",
        }}
      >
        <h3>Editing Subsection: {subsectionId}</h3>
        <LayoutEditor subsectionId={subsectionId} />
        <div style={{ textAlign: "right", marginTop: 12 }}>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
