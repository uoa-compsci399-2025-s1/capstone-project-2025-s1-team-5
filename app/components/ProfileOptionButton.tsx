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

const ProfileOptionButton: React.FC<ProfileOptionButtonProps> = ({
  title,
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
      <StyledText type="boldLabel" style={styles.text}>
        {title}
      </StyledText>
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
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  noLeftMargin: {},
  noRightMargin: {},
});

export default ProfileOptionButton;
