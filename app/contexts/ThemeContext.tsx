import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { lightTheme, darkTheme } from '@/theme/theme';
import { UserContext } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorPreference = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  colorPreference: ColorPreference;
  setCustomTheme: (pref: ColorPreference) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  isDarkMode: false,
  colorPreference: 'system',
  setCustomTheme: async () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

const isColorPreference = (val: string | null): val is ColorPreference =>
  val === 'light' || val === 'dark' || val === 'system';

const resolveIsDarkMode = (
  pref: ColorPreference,
  system: ColorSchemeName
): boolean => {
  if (pref === 'dark') return true;
  if (pref === 'light') return false;
  return system === 'dark';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [colorPreference, setColorPreference] =
    useState<ColorPreference>('system');

  const { user } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      let pref: ColorPreference = 'system';

      if (user.colorPref === 'light' || user.colorPref === 'dark' || user.colorPref === 'system') {
        pref = user.colorPref;
      } else {
        const stored = await AsyncStorage.getItem('USER_THEME_PREFERENCE');
        if (isColorPreference(stored)) {
          pref = stored;
        }
      }

      setColorPreference(pref);
      setIsDarkMode(resolveIsDarkMode(pref, systemColorScheme));
    })();
  }, [user.colorPref, systemColorScheme]);

  const setCustomTheme = async (pref: ColorPreference) => {
    setColorPreference(pref);
    setIsDarkMode(resolveIsDarkMode(pref, systemColorScheme));
    await AsyncStorage.setItem('USER_THEME_PREFERENCE', pref);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, colorPreference, setCustomTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
