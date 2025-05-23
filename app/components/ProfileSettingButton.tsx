import React, {useContext} from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StyledText from '@/components/StyledText';

interface ProfileSettingButtonProps {
  label: string;
  onPress: () => void;
  iconName?: 'vpn-key' | 'palette' | 'help' | 'exit-to-app' | 'person' | 'edit' | 'mail' | 'language' | 'tag-faces';
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
  showDivider?: boolean;
}
const ProfileSettingButton: React.FC<ProfileSettingButtonProps> = ({
  label,
  onPress,
  iconName,
  style,
  showDivider = true,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: '#0c0c48',
          },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {iconName && (
          <MaterialIcons name={iconName} size={24} color="#ffffff" style={styles.icon} />
        )}
        <StyledText type="label" style={styles.label}>
          {label}
        </StyledText>
        <MaterialIcons name="chevron-right" size={24} color="#ffffff" style={styles.arrow} />
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: "19.7%",
    paddingHorizontal: "6%",
  },
  icon: {
    marginRight: "6%",
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
  },
  arrow: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,

  },
});

export default ProfileSettingButton;
