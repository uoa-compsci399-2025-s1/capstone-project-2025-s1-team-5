// src/pages/BlockEditorModal.tsx
import React, { useState, useEffect } from "react";
import LayoutEditor, { LayoutConfig } from "../components/LayoutEditor";
import api from "../lib/api";

export interface BlockEditorModalProps {
  subsectionId: string;
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
  onClose: () => void;
  onLayoutChange: (layout: LayoutConfig) => void;
}

export default function BlockEditorModal({
  subsectionId,
  initialTitle,
  onTitleChange,
  onClose,
  onLayoutChange, 
}: BlockEditorModalProps) {
  // 本地标题状态
  const [title, setTitle] = useState(initialTitle);
  // 本地布局状态，用于一次性保存
  const [layout, setLayout] = useState<LayoutConfig>({ sections: [] });
  const [loading, setLoading] = useState(true);

  // 1) 同步 initialTitle
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  // 2) 拉布局
  useEffect(() => {
    setLoading(true);
    api
      .get<{ layout: LayoutConfig }>(
        `/modules/subsection/${subsectionId}`
      )
      .then((res) => {
        setLayout(res.data.layout);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [subsectionId]);

  // 3) 点击保存：先更新 title，再更新 layout
  const handleSaveAll = async () => {
    try {
      // 更新标题
      await api.put(`/modules/subsection/${subsectionId}`, {
        title,
      });
      // 更新布局
      await api.put(`/modules/subsection/${subsectionId}/layout`, { sections: layout.sections });
      // 通知父组件
      onLayoutChange(layout); 
      onTitleChange(title);
      onClose();
    } catch (err) {
      console.error(err);
      alert("保存失败，请重试");
    }
  };

  return (
    // 整层蒙版
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      {/* 内容容器 */}
      <div
        style={{
          position: "relative",
          width: "90vw",
          maxWidth: 1200,
          maxHeight: "90vh",
          backgroundColor: "#fff",
          padding: 32,
          borderRadius: 8,
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题编辑 */}
        <h2 style={{ marginTop: 0 }}>编辑 Subsection</h2>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8 }}>标题：</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* 布局编辑器 */}
        {loading ? (
          <div>加载布局中…</div>
        ) : (
          <LayoutEditor
            layout={layout}
            onChange={(newLayout) => {
              setLayout(newLayout);
              onLayoutChange(newLayout);   // 让外层也能拿到最新 layout
            }}
          />
        )}

        {/* 底部操作按钮 */}
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button
            onClick={handleSaveAll}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            保存全部
          </button>
          <button
            onClick={onClose}
            style={{
              marginLeft: 12,
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
