import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

type SubmitButtonProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SubmitButton({ text, onPress, style }: SubmitButtonProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }, style]} onPress={onPress}>
      <StyledText type="boldLabel" style={{ color: '#FFFFFF' }}>{text}</StyledText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
  },
});
