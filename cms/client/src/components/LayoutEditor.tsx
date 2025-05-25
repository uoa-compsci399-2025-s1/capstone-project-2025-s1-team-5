// src/components/LayoutEditor.tsx
import React, { useState } from "react";
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
  // 记录正在编辑的区块：哪一节、哪一列、哪一个区块，以及临时 html
  const [editing, setEditing] = useState<{
    sectionIndex: number;
    columnIndex: number;
    blockIndex: number;
    html: string;
  } | null>(null);

  // 新增 Section
  const handleAddSection = () => {
    const newSection: SectionConfig = {
      id: uuid(),
      layout: "full",
      columns: [{ blocks: [] }],
    };
    onChange({ sections: [...layout.sections, newSection] });
  };

  // 删除 Section
  const handleDeleteSection = (secId: string) => {
    onChange({
      sections: layout.sections.filter((s) => s.id !== secId),
    });
  };

  // 切换布局模式
  const handleToggleLayout = (i: number, mode: "full" | "split") => {
    const newSections = [...layout.sections];
    const sec = { ...newSections[i] };
    const allBlocks = sec.columns.flatMap((c) => c.blocks);
    if (mode === "full") {
      sec.layout = "full";
      delete sec.splitRatio;
      sec.columns = [{ blocks: allBlocks }];
    } else {
      sec.layout = "split";
      sec.splitRatio = [50, 50];
      sec.columns = [{ blocks: allBlocks }, { blocks: [] }];
    }
    newSections[i] = sec;
    onChange({ sections: newSections });
  };

  // 修改 splitRatio
  const handleSplitRatio = (i: number, a: number, b: number) => {
    const newSections = [...layout.sections];
    newSections[i] = { ...newSections[i], splitRatio: [a, b] };
    onChange({ sections: newSections });
  };

  // 删除 Block
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

  // 新增文本 Block
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
      <h3>Layout Management</h3>

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

          {/* 列渲染 */}
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
                      ? "Left Column"
                      : "Right Column"
                    : "Full Width"}
                </strong>

                {col.blocks.map((blk, bi) => {
                  const isEditing =
                    editing &&
                    editing.sectionIndex === si &&
                    editing.columnIndex === ci &&
                    editing.blockIndex === bi;

                  return (
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
                      {/* 删除按钮 */}
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

                      {/* 编辑按钮 */}
                      {!isEditing && (
                        <button
                          onClick={() =>
                            setEditing({
                              sectionIndex: si,
                              columnIndex: ci,
                              blockIndex: bi,
                              html: blk.html,
                            })
                          }
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 32,
                            background: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "2px 6px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                      )}

                      {/* 如果在编辑状态，展示 TextEditor */}
                      {isEditing ? (
                        <>
                          <TextEditor
                            content={editing.html}
                            onChange={(newHtml) =>
                              setEditing((e) =>
                                e ? { ...e, html: newHtml } : e
                              )
                            }
                          />
                          <div style={{ textAlign: "right", marginTop: 4 }}>
                            <button
                              onClick={() => {
                                // 写回 html
                                const newLayout = { ...layout };
                                newLayout.sections[si].columns[ci].blocks[
                                  bi
                                ].html = editing.html;
                                onChange(newLayout);
                                setEditing(null);
                              }}
                              style={{
                                marginRight: 8,
                                background: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "4px 12px",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              style={{
                                background: "#6c757d",
                                color: "#fff",
                                border: "none",
                                padding: "4px 12px",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: blk.html }}
                        />
                      )}
                    </div>
                  );
                })}

                {/* 添加 文本 Block */}
                <TextBlockAdder
                  onSave={(html) => handleAddTextBlock(si, ci, html)}
                />
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
        + Add Section
      </button>
    </div>
  );
}

// TextBlockAdder 保持不变
function TextBlockAdder({ onSave }: { onSave: (html: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [html, setHtml] = useState("<p>Enter content...</p>");

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
        + Add Text Area
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
          Save Block
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
          Cancel
        </button>
      </div>
    </div>
  );
}
