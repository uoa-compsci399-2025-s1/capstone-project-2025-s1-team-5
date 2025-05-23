import React, { useState, useEffect } from "react";
import api from "../lib/api";
import LayoutEditor from "../components/LayoutEditor";

interface BlockEditorModalProps {
  subsectionId: string;
  onClose: () => void;
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
}

function BlockEditorModal({
  subsectionId,
  initialTitle,
  onTitleChange,
  onClose,
}: BlockEditorModalProps) {
  // 本地 title state
  const [title, setTitle] = useState(initialTitle);

  // 当父组件 initialTitle 变化时同步
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  // 点击“保存布局”时，一并提交 title
  const handleSaveAll = async () => {
    // 1) 先保存布局
    // （假设 LayoutEditor 里有一个 saveLayout 方法，可以暴露出来，或者
    //  你也可以让 LayoutEditor 把最新 layout 通过回调给这里，然后一并 PUT）
    // 2) 再保存 title
    await api.put(`/modules/subsection/${subsectionId}`, {
      title,
      // 如果你要也更新 body，可以额外传 body
    });
    onTitleChange(title);
    onClose();
  };

  return (
    <div >
      <h3>Editing Subsection</h3>

      {/* 新增：标题编辑 */}
      <div style={{ marginBottom: 12 }}>
        <label>Subsection Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 4, fontSize: "1rem" }}
        />
      </div>

      {/* 原来的布局编辑区 */}
      <LayoutEditor subsectionId={subsectionId} />

      {/* 底部按钮：保存标题+布局，一起提交 */}
      <div style={{ textAlign: "right", marginTop: 12 }}>
        <button type="button" onClick={handleSaveAll}>
          保存
        </button>
        <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
          取消
        </button>
      </div>
    </div>
  );
}
