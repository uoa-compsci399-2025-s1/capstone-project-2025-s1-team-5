import React, { useState } from 'react';
import * as MdIcons from 'react-icons/md';

// 把 MdIcons 里的所有导出组件过滤出来
const ICONS = Object.entries(MdIcons)
  .filter(([key]) => key.startsWith('Md'))   // 只要 MaterialIcons 系列
  .map(([key, Comp]) => ({ key, Comp }));

interface IconPickerProps {
  value?: string;                    // 当前选的 iconKey，比如 "MaterialIcons#home"
  onChange: (iconKey: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');

  // 过滤搜索结果
  const filtered = ICONS.filter(icon =>
    icon.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <input
        type="text"
        placeholder="搜索 icon（如 home)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 4, marginBottom: 8, width: 200 }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 8,
          maxHeight: 200,
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: 8,
        }}
      >
        {filtered.map(({ key, Comp }) => {
          // 把 'MdHome' → 'home'
          const name = key.replace(/^Md/, '').replace(/([A-Z])/g, l => l.toLowerCase());
          const iconKey = `MaterialIcons#${name}`;

          return (
            <div
              key={key}
              onClick={() => onChange(iconKey)}
              style={{
                cursor: 'pointer',
                padding: 4,
                border: value === iconKey ? '2px solid #1890ff' : '1px solid #ddd',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <Comp size={24} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
