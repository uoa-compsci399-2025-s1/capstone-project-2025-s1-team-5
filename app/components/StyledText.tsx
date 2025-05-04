import React, { useContext } from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

type StyledTextProps = {
  children: React.ReactNode;
  type: 'default' | 'note' | 'title' | 'subtitle' | 'label' | 'boldLabel' | 'subtleLabel' | 'error' | 'success';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  style?: StyleProp<TextStyle>;
};

export default function StyledText({
  children,
  type,
  numberOfLines,
  ellipsizeMode,
  style,
}: StyledTextProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <Text
      style={[
        type === 'default' ? [styles.default, { color: theme.text }] : undefined,
        type === 'note' ? [styles.note, { color: theme.subtextOne }] : undefined,
        type === 'title' ? [styles.title, { color: theme.text, fontFamily: 'National-Bold' }] : undefined,
        type === 'subtitle' ? [styles.subtitle, { color: theme.text, fontFamily: 'National-Regular' }] : undefined,
        type === 'label' ? [styles.label, { color: theme.text, fontFamily: 'National-Regular' }] : undefined,
        type === 'boldLabel' ? [styles.boldLabel, { color: theme.text, fontFamily: 'National-Bold' }] : undefined,
        type === 'subtleLabel' ? [styles.subtleLabel, { color: theme.subtextOne, fontFamily: 'National-Light' }] : undefined,
        type === 'error' ? [styles.error, { color: theme.error, fontFamily: 'National-Regular' }] : undefined,
        type === 'success' ? [styles.success, { color: 'green', fontFamily: 'National-Regular' }] : undefined, 
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
    fontFamily: 'National-Regular',
  },
  note: {
    fontSize: 14,
    fontFamily: 'National-Regular',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'National-Bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'National-Regular',
  },
  label: {
    fontSize: 17,
    fontFamily: 'National-Regular',
  },
  boldLabel: {
    fontSize: 17,
    fontWeight: 'bold',
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
    color: 'green', 
  },
});
