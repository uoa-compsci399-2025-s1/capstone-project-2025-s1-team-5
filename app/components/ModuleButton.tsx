import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Icon } from './Icon';  
import StyledText from '@/components/StyledText';

interface ModuleButtonProps {
  title: string;
  onPress: () => void;
  iconKey?: string; 
}

export default function ModuleButton({
  title,
  onPress,
  iconKey,
}: ModuleButtonProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {iconKey && (
          <View style={styles.iconContainer}>
            <Icon iconKey={iconKey} size={65} color="#fff" />
          </View>
        )}
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
    height: 130,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 70,             
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,       
  },
  textContainer: {
    flex: 1,              
    justifyContent: 'center',
  },
  textWhite: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
});

