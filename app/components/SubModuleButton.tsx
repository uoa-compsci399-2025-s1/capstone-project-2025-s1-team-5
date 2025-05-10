import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StyledText from '@/components/StyledText'; 
import { ThemeContext } from '@/contexts/ThemeContext';

interface SubmoduleButtonProps {
  title: string;
  onPress: () => void;
  iconName?: 'info' | 'touch-app'; 
}

export default function SubmoduleButton({ title, onPress, iconName }: SubmoduleButtonProps) {
  const {theme} = useContext(ThemeContext)
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]} onPress={onPress}>
      {iconName && (
        <View style={styles.iconContainer}> <MaterialIcons name={iconName} size={24} color="#fff" /></View>
      )}
      <StyledText type="default" style={styles.buttonText}>{title}</StyledText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row', 
    marginVertical: 5, 
  },
  buttonText: {
    fontSize: 14, 
    fontWeight: 'normal', 
    color: '#FFFFFF',
    marginLeft: 10, 
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
