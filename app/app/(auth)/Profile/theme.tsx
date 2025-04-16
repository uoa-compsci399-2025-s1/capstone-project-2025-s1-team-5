import React, { useContext } from 'react';
import { View, Switch, StyleSheet } from 'react-native';

import { ThemeContext } from '../../contexts/ThemeContext';
import { darkTheme } from '@/app/theme/_theme';
import StyledText from '@/components/StyledText';

const ThemeScreen: React.FC = () => {
  const { theme, setCustomTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <StyledText type="label">Dark Mode:</StyledText>
        <Switch
          value={theme === darkTheme}
          onValueChange={(val) => setCustomTheme?.(val)}
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
