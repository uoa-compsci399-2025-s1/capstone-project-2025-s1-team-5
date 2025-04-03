import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SubmoduleButtonProps {
  title: string;
  onPress: () => void;
  iconName?: 'info' | 'touch-app' ; 
}

export default function SubmoduleButton({ title, onPress, iconName }: SubmoduleButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#00467f' }]} 
      onPress={onPress}
    >
      {iconName && (
        <View style={styles.iconContainer}>
          <MaterialIcons name={iconName} size={24} color="#fff" />
        </View>
      )}
      <Text style={styles.buttonText}>{title}</Text>
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
