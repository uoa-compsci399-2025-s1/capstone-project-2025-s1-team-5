import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme/theme';

interface ThemeContextProps {
  theme: typeof lightTheme;
  // 如果需要用户自定义切换，可以加上 toggleTheme 函数
  setCustomTheme?: (isDark: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 获取系统颜色方案，返回 'light' 或 'dark'
  const systemColorScheme = useColorScheme();
  // 初始状态根据系统主题设置
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');

  // 如果系统主题发生变化，就自动更新
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // 当前主题，根据 isDarkMode 决定使用哪个主题对象
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setCustomTheme: setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
