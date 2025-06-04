import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StyledText from '@/components/StyledText';

interface ModuleButtonProps {
  title: string;
  onPress: () => void;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

export default function ModuleButton({ title, onPress, iconName }: ModuleButtonProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={iconName} size={60} color="#FFF" />
        </View>
        <View style={styles.textContainer}>
          <StyledText type="subtitle" style={styles.textWhite}>{title}</StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 125,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textWhite: {
    color: '#FFFFFF',
  },
});
