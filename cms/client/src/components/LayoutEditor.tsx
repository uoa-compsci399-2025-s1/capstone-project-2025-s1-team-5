// src/components/LayoutEditor.tsx
import React, { useEffect, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import api from '../lib/api';
import TextEditor from './TextEditor';  // 你现有的富文本编辑器

// Block 类型
interface LayoutBlock {
  id: string;               // 唯一 ID
  type: 'text';             // 暂时只做 text
  html: string;             // 文本的 HTML
  side: 'left' | 'right';   // 左右列
  order: number;            // 排序
}

// 布局配置
interface LayoutConfig {
  split: [number, number];  // 左右比例
  blocks: LayoutBlock[];
}

export default function LayoutEditor({ subsectionId }: { subsectionId: string }) {
  const [layout, setLayout] = useState<LayoutConfig>({
    split: [50, 50],
    blocks: [],
  });
  const [showAdd, setShowAdd] = useState(false);
  const [tempHtml, setTempHtml] = useState('<p>Enter text…</p>');
  const [tempSide, setTempSide] = useState<'left'|'right'>('left');

  const sensors = useSensors(useSensor(PointerSensor));

  // 拉取现有 layout
  useEffect(() => {
    api.get<{ layout: LayoutConfig }>(`/modules/subsection/${subsectionId}`)
      .then(res => setLayout(res.data.layout))
      .catch(console.error);
  }, [subsectionId]);

  // 添加文本区块
  const handleAddBlock = () => {
    const newBlock: LayoutBlock = {
      id: uuidv4(),
      type: 'text',
      html: tempHtml,
      side: tempSide,
      order: layout.blocks.length + 1,
    };
    setLayout(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setShowAdd(false);
  };

  // 拖拽结束：更新 order
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setLayout(prev => {
      const old = prev.blocks.findIndex(b => b.id === active.id);
      const nw  = prev.blocks.findIndex(b => b.id === over.id);
      const sorted = arrayMove(prev.blocks, old, nw)
        .map((b,i) => ({ ...b, order: i+1 }));
      return { ...prev, blocks: sorted };
    });
  };

  // 保存到后端
  const handleSave = () => {
    api.put(`/modules/subsection/${subsectionId}/layout`, layout)
      .then(() => alert('保存成功'))
      .catch(() => alert('保存失败'));
  };

  // 分栏渲染
  const left  = layout.blocks.filter(b => b.side==='left').sort((a,b)=>a.order-b.order);
  const right = layout.blocks.filter(b => b.side==='right').sort((a,b)=>a.order-b.order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 添加文本区块按钮 */}
      <button type="button" onClick={() => setShowAdd(x=>!x)}>
        {showAdd ? '取消添加' : '添加文本区块'}
      </button>

      {/* 文本编辑 & 侧边选择 */}
      {showAdd && (
        <div style={{ border: '1px solid #ccc', padding: 12 }}>
          <TextEditor content={tempHtml} onChange={setTempHtml} />
          <div style={{ marginTop: 8 }}>
            <label>
              侧边:
              <select
                value={tempSide}
                onChange={e => setTempSide(e.target.value as 'left'|'right')}
              >
                <option value="left">左栏</option>
                <option value="right">右栏</option>
              </select>
            </label>
            <button onClick={handleAddBlock} style={{ marginLeft: 12 }}>
              确定添加
            </button>
          </div>
        </div>
      )}

      {/* 拖拽布局 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          {/* 左栏 */}
          <SortableContext
            items={left.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ flex: layout.split[0], padding: 8, border: '1px solid #ddd' }}>
              <h4>左栏</h4>
              {left.map(b => (
                <BlockItem key={b.id} block={b} />
              ))}
            </div>
          </SortableContext>
          {/* 右栏 */}
          <SortableContext
            items={right.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ flex: layout.split[1], padding: 8, border: '1px solid #ddd' }}>
              <h4>右栏</h4>
              {right.map(b => (
                <BlockItem key={b.id} block={b} />
              ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>

      {/* 保存按钮 */}
      <div style={{ textAlign: 'right' }}>
        <button onClick={handleSave}>保存布局</button>
      </div>
    </div>
  );
}

// Block 渲染和拖拽句柄
function BlockItem({ block }: { block: LayoutBlock }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 8,
        marginBottom: 8,
        background: '#fafafa',
        border: '1px solid #ccc',
        borderRadius: 4,
      }}
      {...attributes}
      {...listeners}
    >
      <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: block.html }} />
    </div>
  );
}
