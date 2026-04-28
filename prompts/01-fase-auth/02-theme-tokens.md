# 02 — Theme tokens + ThemeProvider

## Objetivo
Centralizar todos los tokens de diseño (colores light/dark, tipografía, spacing, radius, shadows) en `theme/tokens.ts` y exponer un `ThemeProvider` con hook `useTheme()` que resuelve light/dark según preferencia del sistema.

## Pre-requisitos
- Módulo 01 completado (`app/` scaffold listo)

## Contexto necesario
- `prompts/00-MASTER.md` sección 4 (design tokens completos)
- `design_handoff_wallateam_mvp/lib/wallateam-ui.jsx` líneas 4-47 (WT_THEMES original)
- `design_handoff_wallateam_mvp/README.md` líneas 51-145 (tokens RN)

## Tareas

### 1. Crear `app/theme/tokens.ts`

```ts
export const colors = {
  primary:        '#16A085',
  primaryDark:    '#138D75',
  secondary:      '#1F3A5F',
  accent:         '#2ECC71',
  background:     '#FFFFFF',
  surface:        '#F8F9FA',
  surfaceAlt:     '#F1F4F6',
  textPrimary:    '#2C3E50',
  textSecondary:  '#7F8C8D',
  border:         '#E5E7EB',
  danger:         '#E74C3C',
  warning:        '#F39C12',
  success:        '#2ECC71',
  chipBg:         'rgba(22,160,133,0.10)',
  chipBgBlue:     'rgba(31,58,95,0.08)',
} as const;

export const colorsDark = {
  primary:        '#16A085',
  primaryDark:    '#138D75',
  secondary:      '#5DA9E9',
  accent:         '#2ECC71',
  background:     '#0E1B2C',
  surface:        '#15263C',
  surfaceAlt:     '#1B2E47',
  textPrimary:    '#ECF0F1',
  textSecondary:  '#9AA8B6',
  border:         '#243B58',
  danger:         '#FF6B5B',
  warning:        '#F39C12',
  success:        '#2ECC71',
  chipBg:         'rgba(46,204,113,0.14)',
  chipBgBlue:     'rgba(93,169,233,0.16)',
} as const;

export type Colors = typeof colors;

export const typography = {
  fontFamily: {
    regular:  'Inter_400Regular',
    medium:   'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold:     'Inter_700Bold',
  },
  fontSize: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28, '3xl': 36,
  },
  lineHeight: { sm: 18, base: 22, lg: 26 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const radius = { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 } as const;

export const shadows = {
  card: {
    shadowColor: '#1F3A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHi: {
    shadowColor: '#1F3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaPrimary: {
    shadowColor: '#16A085',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const gradients = {
  ctaPrimary: ['#16A085', '#1F3A5F'] as const,
} as const;
```

### 2. Crear `app/theme/ThemeProvider.tsx`

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, colorsDark, typography, spacing, radius, shadows, gradients, Colors } from './tokens';

type Mode = 'light' | 'dark' | 'system';

interface Theme {
  colors: Colors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  gradients: typeof gradients;
  mode: 'light' | 'dark';
}

const STORAGE_KEY = '@wt:theme-mode';

const ThemeContext = createContext<{
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      if (v === 'light' || v === 'dark' || v === 'system') setModeState(v);
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystemScheme(colorScheme));
    return () => sub.remove();
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m);
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

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

### 3. Envolver `app/_layout.tsx` con ThemeProvider

```tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

function StatusBarWithTheme() {
  const { theme } = useTheme();
  return <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBarWithTheme />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

### 4. Actualizar `app/index.tsx` para validar el tema

```tsx
import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function Index() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary }}>primary: {theme.colors.primary}</Text>
      <Text style={{ color: theme.colors.textPrimary }}>mode: {theme.mode}</Text>
    </View>
  );
}
```

## Validación

- `npx expo start` arranca sin errores
- En Expo Go aparece `primary: #16A085` y `mode: light` (o `dark` según el OS)
- Cambiar el tema del sistema operativo y recargar → cambia `mode`
- `npx tsc --noEmit` sin errores

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [01.02] 2026-MM-DD — Theme tokens + ThemeProvider
- ✅ `theme/tokens.ts` con colors light/dark, typography, spacing, radius, shadows, gradients
- ✅ `theme/ThemeProvider.tsx` con context + hook `useTheme()` + persistencia AsyncStorage
- ✅ Soporte modo system/light/dark (default system)
- 📁 Tocados: `app/theme/tokens.ts`, `app/theme/ThemeProvider.tsx`, `app/app/_layout.tsx`, `app/app/index.tsx`
- 🧪 Verificación: pantalla muestra `primary: #16A085`, mode reacciona a OS
```

### Update `STATE.md`
- **Último módulo completado:** 02-theme-tokens
- **Próximo módulo a ejecutar:** prompts/01-fase-auth/03-fonts-inter.md
