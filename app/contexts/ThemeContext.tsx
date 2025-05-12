import React, { createContext, useState, useEffect, ReactNode, useContext} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '@/theme/theme';
import { UserContext } from './UserContext';


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
  const {user} = useContext(UserContext);

  useEffect(() => {
    (async () => {
      if (user.colorPref === 'light' || user.colorPref === 'dark') {
        setIsDarkMode(user.colorPref === 'dark')
        return
      }
      const stored = await AsyncStorage.getItem('USER_THEME_PREFERENCE');
      if (stored === 'light' || stored === 'dark') {
        setIsDarkMode(stored === 'dark');
        return
      } 
      setIsDarkMode(systemColorScheme === 'dark')
    })();
  }, [user.colorPref, systemColorScheme]);

  const setCustomTheme = async (useDark: boolean) => {
    setIsDarkMode(useDark);
    await AsyncStorage.setItem('USER_THEME_PREFERENCE', useDark ? 'dark' : 'light');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setCustomTheme}}>{children}</ThemeContext.Provider>
  );
};
