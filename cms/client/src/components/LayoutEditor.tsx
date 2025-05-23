// src/components/LayoutEditor.tsx
import React, {useState} from "react";
import { v4 as uuid } from "uuid";
import TextEditor from "./TextEditor";

export interface BlockConfig {
  id: string;
  type: "text";
  html: string;
}

export interface ColumnConfig {
  blocks: BlockConfig[];
}

export interface SectionConfig {
  id: string;
  layout: "full" | "split";
  splitRatio?: number[];
  columns: ColumnConfig[];
}

export interface LayoutConfig {
  sections: SectionConfig[];
}

interface LayoutEditorProps {
  layout: LayoutConfig;
  onChange: (newLayout: LayoutConfig) => void;
}

export default function LayoutEditor({
  layout,
  onChange,
}: LayoutEditorProps) {
  // —— 1. 新增 Section
  const handleAddSection = () => {
    // 明确告诉 TS：这是一个 SectionConfig
    const newSection: SectionConfig = {
      id: uuid(),
      layout: "full",           // 这里 "full" 就是字面量类型，不会被宽化
      columns: [{ blocks: [] }],
    };

    onChange({
      sections: [...layout.sections, newSection],
    });
  };

  // —— 2. 删除 Section
  const handleDeleteSection = (secId: string) => {
    onChange({
      sections: layout.sections.filter((s) => s.id !== secId),
    });
  };

  // —— 3. 切换 Section 布局
  const handleToggleLayout = (i: number, mode: "full" | "split") => {
    const newSections = [...layout.sections];
    const sec = { ...newSections[i] };
    if (mode === "full") {
      const all = sec.columns.flatMap((c) => c.blocks);
      sec.layout = "full";
      delete sec.splitRatio;
      sec.columns = [{ blocks: all }];
    } else {
      const all = sec.columns.flatMap((c) => c.blocks);
      sec.layout = "split";
      sec.splitRatio = [50, 50];
      sec.columns = [{ blocks: all }, { blocks: [] }];
    }
    newSections[i] = sec;
    onChange({ sections: newSections });
  };

  // —— 4. 修改比例
  const handleSplitRatio = (i: number, a: number, b: number) => {
    const newSections = [...layout.sections];
    newSections[i] = { ...newSections[i], splitRatio: [a, b] };
    onChange({ sections: newSections });
  };

  // —— 5. 删除 Block
  const handleDeleteBlock = (
    si: number,
    ci: number,
    blockId: string
  ) => {
    const newSections = [...layout.sections];
    newSections[si].columns[ci].blocks = newSections[si].columns[ci].blocks.filter(
      (b) => b.id !== blockId
    );
    onChange({ sections: newSections });
  };

  // —— 6. 添加文本 Block
  const handleAddTextBlock = (
    si: number,
    ci: number,
    html: string
  ) => {
    const newSections = [...layout.sections];
    newSections[si].columns[ci].blocks.push({
      id: uuid(),
      type: "text",
      html,
    });
    onChange({ sections: newSections });
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>Sections 布局管理</h3>

      {layout.sections.map((sec, si) => (
        <div
          key={sec.id}
          style={{
            position: "relative",
            marginBottom: 24,
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        >
          {/* 删除 Section */}
          <button
            onClick={() => handleDeleteSection(sec.id)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              border: "none",
              background: "transparent",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          {/* 布局切换 */}
          <div style={{ marginBottom: 8 }}>
            <strong>Section {si + 1}:</strong>
            <label style={{ marginLeft: 12 }}>
              <input
                type="radio"
                checked={sec.layout === "full"}
                onChange={() => handleToggleLayout(si, "full")}
              />{" "}
              Full
            </label>
            <label style={{ marginLeft: 12 }}>
              <input
                type="radio"
                checked={sec.layout === "split"}
                onChange={() => handleToggleLayout(si, "split")}
              />{" "}
              Split
            </label>

            {/* 比例选择 */}
            {sec.layout === "split" && (
              <select
                value={sec.splitRatio?.join("-")}
                onChange={(e) => {
                  const [a, b] = e.target.value.split("-").map(Number);
                  handleSplitRatio(si, a, b);
                }}
                style={{ marginLeft: 12 }}
              >
                <option value="30-70">30 / 70</option>
                <option value="50-50">50 / 50</option>
                <option value="70-30">70 / 30</option>
              </select>
            )}
          </div>

          {/* 列 渲染 */}
          <div style={{ display: "flex", gap: 12 }}>
            {sec.columns.map((col, ci) => (
              <div
                key={ci}
                style={{
                  flex:
                    sec.layout === "split" && sec.splitRatio
                      ? sec.splitRatio[ci]
                      : 1,
                  border: "1px dashed #ccc",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                <strong>
                  {sec.layout === "split"
                    ? ci === 0
                      ? "左栏"
                      : "右栏"
                    : "整行"}
                </strong>

                {/* 文本 Block 列表 */}
                {col.blocks.map((blk) => (
                  <div
                    key={blk.id}
                    style={{
                      position: "relative",
                      margin: "8px 0",
                      padding: 8,
                      background: "#f9f9f9",
                      borderRadius: 4,
                    }}
                  >
                    <button
                      onClick={() => handleDeleteBlock(si, ci, blk.id)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                    <div dangerouslySetInnerHTML={{ __html: blk.html }} />
                  </div>
                ))}

                {/* 添加 文本 Block */}
                <TextBlockAdder onSave={(html) => handleAddTextBlock(si, ci, html)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 新增 Section */}
      <button
        type="button"
        onClick={handleAddSection}
        style={{
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        + 新增 Section
      </button>
    </div>
  );
}

// TextBlockAdder 保持不变
function TextBlockAdder({ onSave }: { onSave: (html: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [html, setHtml] = useState("<p>请输入内容…</p>");

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        style={{
          marginTop: 8,
          background: "#007bff",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        + 添加文本
      </button>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <TextEditor content={html} onChange={setHtml} />
      <div style={{ marginTop: 4, textAlign: "right" }}>
        <button
          onClick={() => {
            onSave(html);
            setEditing(false);
          }}
          style={{
            background: "#28a745",
            color: "#fff",
            border: "none",
            padding: "4px 12px",
            borderRadius: 4,
            cursor: "pointer",
            marginRight: 8,
          }}
        >
          保存块
        </button>
        <button
          onClick={() => setEditing(false)}
          style={{
            background: "#6c757d",
            color: "#fff",
            border: "none",
            padding: "4px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}
