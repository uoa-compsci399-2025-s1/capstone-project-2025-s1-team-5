import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import useTheme from '@/hooks/useTheme';

type StyledTextProps = {
  children: React.ReactNode;
  type: 'default' | 'note' | 'title' | 'subtitle' | 'label' | 'boldLabel' | 'subtleLabel' | 'error';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  style?: StyleProp<TextStyle>;
};

export default function StyledText({
  children,
  type,
  numberOfLines,
  ellipsizeMode,
  style
}: StyledTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        type === 'default' ? [styles.default, {color: theme.text}] : undefined,
        type === 'note' ? [styles.note, {color: theme.subtextOne}]: undefined,
        type === 'title' ? [styles.title, {color: theme.text}]: undefined,
        type === 'subtitle' ? [styles.subtitle, {color: theme.text}] : undefined,
        type === 'label' ? [styles.label, {color: theme.text}]: undefined,
        type === 'boldLabel' ? [styles.boldLabel, {color: theme.text}]: undefined,
        type === 'subtleLabel' ? [styles.subtleLabel, {color: theme.subtextOne}]: undefined,
        type === 'error' ? [styles.error, {color: theme.error}]: undefined,
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 26,
  },
  label: {
    fontSize: 18,
  },
  boldLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtleLabel: {
    fontSize: 18,
  },
  error: {
    fontSize: 14,
  },
});
