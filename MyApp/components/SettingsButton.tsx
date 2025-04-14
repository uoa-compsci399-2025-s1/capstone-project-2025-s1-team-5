import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SettingsButtonProps {
  title: string;
  onPress: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '30%',
    backgroundColor: '#F9DCC4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default SettingsButton;
