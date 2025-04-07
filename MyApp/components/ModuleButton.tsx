import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useTheme from '@/hooks/useTheme';

interface ModuleButtonProps {
  moduleNumber: number;
  title: string;
  onPress: () => void;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

export default function ModuleButton({ moduleNumber, title, onPress, iconName }: ModuleButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <MaterialIcons name={iconName} size={24} color="#FFF" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.moduleText}>Module {moduleNumber}</Text>
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5, 
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center', 
  },
  moduleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
