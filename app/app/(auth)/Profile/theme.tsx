import React, { useContext } from 'react';
import { View, Switch, StyleSheet, Alert } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import api from '@/app/lib/api';

const ThemeScreen: React.FC = () => {
  const { theme, setCustomTheme, colorPreference } = useContext(ThemeContext);

  const isDark = colorPreference === 'dark';

  const handleDarkModeToggle = async () => {
    const newPref = isDark ? 'light' : 'dark';
    setCustomTheme(newPref);
    try {
      await api.patch('/users/me/theme', { colorPref: newPref });
    } catch (e) {
      console.error('Theme update failed', e);
      Alert.alert('Error', 'Could not save your theme preference.');
    }
  };

  const trackColor = isDark ? '#444' : '#ccc';
  const activeTrackColor = isDark ? '#555' : '#888';
  const thumbColor = isDark ? '#ffffff' : '#0c0c48';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>Enable Dark Mode</StyledText>
        <Switch
          value={isDark}
          onValueChange={handleDarkModeToggle}
          trackColor={{ true: activeTrackColor, false: trackColor }}
          thumbColor={isDark ? thumbColor : '#f4f3f4'}
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
