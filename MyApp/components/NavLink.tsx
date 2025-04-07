import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useTheme from '@/hooks/useTheme';

type NavLinkProps = {
  text: string;
  iconName?: 'double-arrow';
  onPress: () => void;
};

export default function NavLink({ text, iconName, onPress }: NavLinkProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.navLinkContainer}>
        {iconName && <MaterialIcons name={iconName} size={16} color={theme.text} />}
        <Text style={[styles.navLinkText, {color: theme.text}]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLinkText: {
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
