import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Icon } from './Icon';
import StyledText from '@/components/StyledText';

interface SubmoduleButtonProps {
  title: string;
  onPress: () => void;
  iconKey?: string; 
}

export default function SubmoduleButton({
  title,
  onPress,
  iconKey,
}: SubmoduleButtonProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {iconKey && (
          <View style={styles.iconContainer}>
            <Icon
              iconKey={iconKey}
              size={46}
              color='#fff'
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <StyledText type="subtitle" style={styles.textWhite}>
            {title}
          </StyledText>
        </View> 
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 100,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'center', 
  },
  content: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textWhite: {
    color: '#FFF',
    textAlign: 'center',  
  },
});
