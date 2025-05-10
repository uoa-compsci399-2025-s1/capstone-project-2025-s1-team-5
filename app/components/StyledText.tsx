import React, { useContext } from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

type TextType = 'default' | 'note' | 'title' | 'subtitle' | 'label' | 'boldLabel' | 'subtleLabel' | 'error' | 'success';

interface StyledTextProps {
  children: React.ReactNode;
  type?: TextType;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  style?: StyleProp<TextStyle>;
}

export default function StyledText({
  children,
  type = 'default',
  numberOfLines,
  ellipsizeMode,
  style,
}: StyledTextProps) {
  const { theme } = useContext(ThemeContext);

  const baseStyle = {
    default: [styles.default, { color: theme.text }],
    note: [styles.note, { color: theme.subtextOne }],
    title: [styles.title, { color: theme.text }],
    subtitle: [styles.subtitle, { color: theme.text }],
    label: [styles.label, { color: theme.text }],
    boldLabel: [styles.boldLabel, { color: theme.text }],
    subtleLabel: [styles.subtleLabel, { color: theme.subtextOne }],
    error: [styles.error, { color: theme.error }],
    success: [styles.success, { color: theme.success }],
  };

  return (
    <Text
      style={[baseStyle[type], style]}
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
    fontFamily: 'National-Regular',
  },
  note: {
    fontSize: 14,
    fontFamily: 'National-Regular',
  },
  title: {
    fontSize: 20,
    fontFamily: 'National-Bold',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'National-SemiBold',
  },
  label: {
    fontSize: 17,
    fontFamily: 'National-Regular',
  },
  boldLabel: {
    fontSize: 17,
    fontFamily: 'National-Bold',
  },
  subtleLabel: {
    fontSize: 16,
    fontFamily: 'National-Light',
  },
  error: {
    fontSize: 14,
    fontFamily: 'National-Regular',
  },
  success: {
    fontSize: 14,
    fontFamily: 'National-Regular',
  },
});