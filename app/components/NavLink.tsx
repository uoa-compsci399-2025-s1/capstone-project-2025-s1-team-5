import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StyledText from '@/components/StyledText'; 

type NavLinkProps = {
  text: string;
  iconName?: 'double-arrow';
  onPress: () => void;
};

export default function NavLink({ text, iconName, onPress }: NavLinkProps) {
  const { theme } = useContext(ThemeContext); 

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.navLinkContainer}>
        {iconName && <MaterialIcons name={iconName} size={16} color={theme.text} />}
        <StyledText type="default" style={[styles.navLinkText, { color: theme.text }]}>{text}</StyledText>
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
