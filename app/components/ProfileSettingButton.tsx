import React, {useContext} from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

interface ProfileSettingButtonProps {
  label: string;
  onPress: () => void;
  iconName?: 'vpn-key' | 'palette' | 'help' | 'exit-to-app' | 'person' | 'edit' | 'mail' | 'language';
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ProfileSettingButton: React.FC<ProfileSettingButtonProps> = ({ label, onPress, iconName, isLast = false, style }) => {
  const { theme } = useContext(ThemeContext);

  // const greyBackgroundColor = '#D3D3D3'; // light grey background for visualisation before darklight theme is implemented

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.backgroundSecondary }, style]}
      onPress={onPress}
    >
      {iconName && <MaterialIcons name={iconName} size={24} color={theme.text} />}
      <StyledText type="label" style={iconName ? { marginLeft: 15 } : null}>{label}</StyledText>
      <MaterialIcons name="chevron-right" size={24} color={theme.text} style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
  },
  arrow: {
    marginLeft: 'auto',
  },
});

export default ProfileSettingButton;
