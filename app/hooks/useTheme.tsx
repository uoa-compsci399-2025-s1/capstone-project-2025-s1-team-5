import React, { useState, useEffect, createContext, useContext } from 'react';
import { Appearance } from 'react-native';

interface Theme {
  primary: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  text: string;
  subtextOne: string;
  error: string;
}

const themes = {
  light: {
    primary: '#00467f', 
    background: '#ffffff',
    backgroundSecondary: '#f2f2f2', 
    backgroundTertiary: '#cccccc', 
    text: '#212121', 
    subtextOne: '#999999', 
    error: '#cc0000', 
  },
  dark: {
    primary: '#00467f', 
    background: '#212121', 
    backgroundSecondary: '#3e3e3e', 
    backgroundTertiary: '#666666', 
    text: '#f0f0f0', 
    subtextOne: '#999999', 
    error: '#cc0000',
  },
};

const ThemeContext = createContext<{ theme: Theme, updateTheme: (themeName: string) => void }>({
  theme: themes.light,
  updateTheme: () => {},
});

type ThemeProviderProps = {
  children: React.ReactNode
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // async needed?
  const [theme, setTheme] = useState(themes.light); // Default to light theme

  useEffect(() => {
    const loadTheme = () => {
      // Set the theme based on the system's default color scheme (light/dark)
      const systemDefault = Appearance.getColorScheme();
      setTheme(systemDefault === 'dark' ? themes.dark : themes.light);
    };
    loadTheme();
  }, []);

  const updateTheme = (themeName: string) => {
    setTheme(themeName === 'dark' ? themes.dark : themes.light);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme() {
  return useContext(ThemeContext);
}
