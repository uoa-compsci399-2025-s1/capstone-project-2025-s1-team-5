import React from 'react';
import * as MdIcons from 'react-icons/md';

export interface IconProps {
  iconKey?: string;       // e.g. "MaterialIcons#home"
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  iconKey,
  size = 24,
  color = '#333',
}) => {
  if (!iconKey) return null;
  const [lib, name] = iconKey.split('#');
  // 只支持 MaterialIcons
  if (lib !== 'MaterialIcons') return null;

  // 把 "home" → "MdHome"
  const componentName = 'Md' + name[0].toUpperCase() + name.slice(1);
  const Component = (MdIcons as any)[componentName] as React.ComponentType<{
    size?: number;
    color?: string;
  }>;

  return Component ? <Component size={size} color={color} /> : null;
};
