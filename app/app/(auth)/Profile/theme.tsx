import React, { useContext } from 'react'
import { View, Switch, StyleSheet, Alert } from 'react-native'
import { ThemeContext } from '@/contexts/ThemeContext'
import StyledText from '@/components/StyledText'
import api from '@/app/lib/api'

const ThemeScreen: React.FC = () => {
  const { theme, isDarkMode, setCustomTheme } = useContext(ThemeContext)

  const changeThemePreference = async (pref: 'light' | 'dark' | 'system') => {
    try {
      const res = await api.patch<{ message: string }>('/users/me/theme', {
        colorPref: pref,
      })
      console.log(res.data.message)
    } catch (e) {
      console.error('Theme update failed', e)
      Alert.alert('Error', 'Could not save your theme preference.')
    }
  }

  const toggleDark = (value: boolean) => {
    setCustomTheme?.(value)
    changeThemePreference(value ? 'dark' : 'light')
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.row}>
        <StyledText type="label" style={{ color: theme.text }}>
          Dark Mode:
        </StyledText>
        <Switch value={isDarkMode} onValueChange={toggleDark} />
      </View>
    </View>
  )
}

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
})

export default ThemeScreen
