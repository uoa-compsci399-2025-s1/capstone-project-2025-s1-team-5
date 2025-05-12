import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

interface ProfileOptionButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isLeftmost: boolean; 
  isRightmost: boolean; 
}

const ProfileOptionButton: React.FC<ProfileOptionButtonProps> = ({ title, onPress, style, isLeftmost, isRightmost }) => {
  const { theme } = useContext(ThemeContext);

  const buttonStyle = [
    styles.button,
    { backgroundColor: theme.primary },
    style,
    isLeftmost && styles.noLeftMargin, 
    isRightmost && styles.noRightMargin, 
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <StyledText type="boldLabel" style={{ color: '#FFFFFF' }}>{title}</StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '48%',
    height: 50,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  noLeftMargin: {
    marginLeft: 0, 
  },
  noRightMargin: {
    marginRight: 0, 
  },
});

export default ProfileOptionButton;
