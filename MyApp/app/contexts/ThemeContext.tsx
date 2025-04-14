import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme/_theme';

interface ThemeContextProps {
  theme: typeof lightTheme;
  setCustomTheme?: (isDark: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setCustomTheme: setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
