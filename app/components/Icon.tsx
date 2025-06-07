import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'; 

type IconLib = 'MaterialIcons' | 'Ionicons' | 'FontAwesome';
const iconMap: Record<IconLib, any> = { MaterialIcons, Ionicons, FontAwesome };

export interface IconProps {
  iconKey?: string;
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  iconKey,
  size = 24,
  color = '#333',
  style,
}) => {
  if (!iconKey) return null;
  const [lib, name] = iconKey.split('#');
  const Comp = iconMap[lib as IconLib];
  if (!Comp) return null;
  return <Comp name={name} size={size} color={color} style={style} />;
};
