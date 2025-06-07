import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ProfileOptionButtonProps {
  title: string;
  iconName: 'insights' | 'location-on';  
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isLeftmost: boolean;
  isRightmost: boolean;
}

const ProfileOptionButton: React.FC<ProfileOptionButtonProps> = ({
  title,
  iconName,
  onPress,
  style,
  isLeftmost,
  isRightmost,
}) => {
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
      <MaterialIcons name={iconName} size={70} color="#fff" />
      <StyledText type="boldLabel" style={styles.text}>{title}</StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'stretch',
    paddingVertical: 20,
    gap: 6,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  noLeftMargin: {},
  noRightMargin: {},
});

export default ProfileOptionButton;
