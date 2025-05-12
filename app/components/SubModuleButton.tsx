import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StyledText from '@/components/StyledText';


interface SubmoduleButtonProps {
  title: string;
  onPress: () => void;
  iconName?: 'info' | 'touch-app';
}

export default function SubmoduleButton({ 
  title, 
  onPress, 
  iconName 
}: SubmoduleButtonProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onPress}>
      {iconName && (
        <View style={styles.iconContainer}><MaterialIcons name={iconName} size={24} color={theme.buttonText} /></View>
      )}
      <StyledText type="label" style={[styles.buttonText, { color: theme.buttonText }]}>{title}</StyledText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    flex: 1,
    marginLeft: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
});