import React, { useContext, useState } from 'react';
import { View, Switch, StyleSheet, Alert } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import api from '@/app/lib/api';

type ColorPreference = 'light' | 'dark' | 'system'; // Adjust according to your existing type

const ThemeScreen: React.FC = () => {
  const { theme, isDarkMode, setCustomTheme, colorPreference } = useContext(ThemeContext);
  const [systemMockUp, setSystemMockUp] = useState(false); // Dummy toggle for system default

  // Function to update the theme preference on the server
  const changeThemePreference = async (pref: 'light' | 'dark') => {
    try {
      const res = await api.patch<{ message: string }>('/users/me/theme', {
        colorPref: pref,
      });
      console.log(res.data.message);
    } catch (e) {
      console.error('Theme update failed', e);
      Alert.alert('Error', 'Could not save your theme preference.');
    }
  };

  // Function to handle theme changes and ensure only one toggle is active
  const handleThemeChange = (pref: 'light' | 'dark' | 'system') => {
    if (pref === 'light' && colorPreference !== 'light') {
      setCustomTheme('light');
      changeThemePreference('light');
      setSystemMockUp(false); // Turn off system toggle if light is selected
    } else if (pref === 'dark' && colorPreference !== 'dark') {
      setCustomTheme('dark');
      changeThemePreference('dark');
      setSystemMockUp(false); // Turn off system toggle if dark is selected
    } else if (pref === 'system' && colorPreference !== 'system') {
      setSystemMockUp(true); // For system default
      setCustomTheme('system'); // Set system as the active theme
    } else {
      // Reset all preferences if user turns off any active theme
      setCustomTheme('system');
      setSystemMockUp(false); // Turn off system toggle
    }
  };

  const trackColor = '#0c0c48';
  const thumbColor = isDarkMode ? '#fff' : '#0c0c48';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>Light</StyledText>
        <Switch
          value={colorPreference === 'light'}
          onValueChange={() => handleThemeChange('light')}
          trackColor={{ true: trackColor, false: '#ccc' }}
          thumbColor={colorPreference === 'light' ? thumbColor : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>Dark</StyledText>
        <Switch
          value={colorPreference === 'dark'}
          onValueChange={() => handleThemeChange('dark')}
          trackColor={{ true: trackColor, false: '#ccc' }}
          thumbColor={colorPreference === 'dark' ? thumbColor : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>System Default</StyledText>
        <Switch
          value={systemMockUp}
          onValueChange={() => handleThemeChange('system')}
          trackColor={{ true: trackColor, false: '#ccc' }}
          thumbColor={systemMockUp ? thumbColor : '#f4f3f4'}
        />
      </View>

      <StyledText type="default" style={{ color: theme.text }}>
        We will adjust your theme based on your device's system settings.
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ThemeScreen;
