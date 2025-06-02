import React, { useContext, useState } from 'react';
import { View, Switch, StyleSheet, Alert } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import api from '@/app/lib/api';

type ColorPreference = 'light' | 'dark' | 'system';

const ThemeScreen: React.FC = () => {
  const { theme, isDarkMode, setCustomTheme, colorPreference } = useContext(ThemeContext);
  const [systemDefault, setsystemDefault] = useState(false); //To be implemented

  const changeThemePreference = async (pref: 'light' | 'dark') => {
    try {
      const res = await api.patch<{ message: string }>('/users/me/theme', {
        colorPref: pref,
      });
    } catch (e) {
      console.error('Theme update failed', e);
      Alert.alert('Error', 'Could not save your theme preference.');
    }
  };

  const handleThemeChange = (pref: 'light' | 'dark' | 'system') => {
    if (pref === 'light' && colorPreference !== 'light') {
      setCustomTheme('light');
      changeThemePreference('light');
      setsystemDefault(false); 
    } else if (pref === 'dark' && colorPreference !== 'dark') {
      setCustomTheme('dark');
      changeThemePreference('dark');
      setsystemDefault(false); 
    } else if (pref === 'system' && colorPreference !== 'system') {
      setsystemDefault(true); 
      setCustomTheme('system'); 
    } else {
      setCustomTheme('system');
      setsystemDefault(false); 
    }
  };

  const trackColor = isDarkMode ? '#444' : '#ccc';  
  const activeTrackColor = isDarkMode ? '#555' : '#888'; 
  const thumbColor = isDarkMode ? '#ffffff' : '#0c0c48'; 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>Light</StyledText>
        <Switch
          value={colorPreference === 'light'}
          onValueChange={() => handleThemeChange('light')}
          trackColor={{ true: activeTrackColor, false: trackColor }}
          thumbColor={colorPreference === 'light' ? thumbColor : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>Dark</StyledText>
        <Switch
          value={colorPreference === 'dark'}
          onValueChange={() => handleThemeChange('dark')}
          trackColor={{ true: activeTrackColor, false: trackColor }}
          thumbColor={colorPreference === 'dark' ? thumbColor : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>System Default</StyledText>
        <Switch
          value={systemDefault}
          onValueChange={() => handleThemeChange('system')}
          trackColor={{ true: activeTrackColor, false: trackColor }}
          thumbColor={systemDefault ? thumbColor : '#f4f3f4'}
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
