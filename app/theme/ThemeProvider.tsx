import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, colorsDark, typography, spacing, radius, shadows, gradients, Colors } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: Colors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  gradients: typeof gradients;
  mode: 'light' | 'dark';
}

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

const STORAGE_KEY = '@wt:theme-mode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') {
          setModeState(v);
        }
      })
      .catch(() => {});

    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystemScheme(colorScheme));
    return () => sub.remove();
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  };

  const resolved: 'light' | 'dark' = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const palette = resolved === 'dark' ? colorsDark : colors;

  const theme: Theme = {
    colors: palette,
    typography,
    spacing,
    radius,
    shadows,
    gradients,
    mode: resolved,
  };

  return <ThemeContext.Provider value={{ theme, mode, setMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
