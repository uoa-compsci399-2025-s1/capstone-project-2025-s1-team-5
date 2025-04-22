import React, { createContext, useState, useEffect, ReactNode} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '@/theme/theme';
import { UserContext } from './UserContext';
const STORAGE_KEY = 'USER_THEME_PREFERENCE';

interface ThemeContextProps {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  setCustomTheme: (useDark: boolean) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  isDarkMode: false,
  setCustomTheme: async () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        setIsDarkMode(stored === 'dark');
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    })();
  }, [systemColorScheme]);

  const setCustomTheme = async (useDark: boolean) => {
    setIsDarkMode(useDark);
    await AsyncStorage.setItem(STORAGE_KEY, useDark ? 'dark' : 'light');
    // persist remotely
    // try {
    //   await fetch('https://xxx/api/me/theme', {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       // include auth token if needed:
    //       Authorization: xxx,
    //     },
    //     body: JSON.stringify({
    //       themePreference: useDark ? 'dark' : 'light',
    //     }),
    //   });
    // } catch (err) {
    //   console.warn('Failed to save theme to server:', err);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setCustomTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
