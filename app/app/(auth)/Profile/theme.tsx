import React, { useContext } from 'react';
import { View, Switch, StyleSheet } from 'react-native';

import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

const ThemeScreen: React.FC = () => {
  const { theme, isDarkMode, setCustomTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text}}>Dark Mode:</StyledText>
        <Switch
          value={isDarkMode}
          onValueChange={setCustomTheme}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ThemeScreen;
