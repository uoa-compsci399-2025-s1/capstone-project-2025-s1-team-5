import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

interface ProfileOptionButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ProfileOptionButton: React.FC<ProfileOptionButtonProps> = ({ title, onPress, style }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }, style]} onPress={onPress}>
      <StyledText type="boldLabel" style={{ color: '#FFFFFF' }}>{title}</StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '47%',
    height: 50,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default ProfileOptionButton;
