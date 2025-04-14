import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {Appearance} from 'react-native';
import {
  darkTheme,
  lightTheme,
  type ThemePalette,
  type ThemeType,
} from '../constants/theme.constant';

// Helper to get the initial theme type
const getInitialThemeType = (): ThemeType => {
  const systemTheme = Appearance.getColorScheme() || 'light';
  // Potentially load saved preference here
  return systemTheme;
};

// --- Define Context Shape ---
interface ThemeContextProps {
  themeType: ThemeType;
  theme: ThemePalette;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
}

// --- Create Context ---
// Provide a default value matching the context shape, though it shouldn't be used directly
const ThemeContext = createContext<ThemeContextProps>({
  themeType: getInitialThemeType(), // Initial default
  theme: getInitialThemeType() === 'dark' ? darkTheme : lightTheme, // Initial default
  setThemeType: () =>
    console.warn('setThemeType called outside of ThemeProvider'),
  toggleTheme: () =>
    console.warn('toggleTheme called outside of ThemeProvider'),
});

// --- Create Provider Component ---
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [themeType, setThemeTypeState] = useState<ThemeType>(
    getInitialThemeType(),
  );

  const theme = useMemo<ThemePalette>(() => {
    return themeType === 'dark' ? darkTheme : lightTheme;
  }, [themeType]);

  const setThemeType = useCallback((type: ThemeType) => {
    setThemeTypeState(type);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeTypeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({colorScheme}) => {
      setThemeType(colorScheme || 'light');
    });
    return () => listener.remove();
  }, [setThemeType]);

  const value = useMemo(
    () => ({
      themeType,
      theme,
      setThemeType,
      toggleTheme,
    }),
    [themeType, theme, setThemeType, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// --- Create Consumer Hook ---
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // This error means the hook is used outside of the ThemeProvider
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
