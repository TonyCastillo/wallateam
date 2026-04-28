# 03 — Carga de fuentes Inter

## Objetivo
Cargar las 4 variantes de Inter (400, 500, 600, 700) vía `@expo-google-fonts/inter`, mostrar splash mientras se cargan, y exponer un helper para resolver familia tipográfica desde un peso.

## Pre-requisitos
- Módulo 01 completado (paquete `@expo-google-fonts/inter` instalado)
- Módulo 02 completado (ThemeProvider activo)

## Contexto necesario
- `prompts/00-MASTER.md` sección 4 (typography tokens)
- Doc oficial: [`expo-font` + `@expo-google-fonts/*`](https://docs.expo.dev/develop/user-interface/fonts/)

## Tareas

### 1. Crear helper `app/theme/typography.ts`

```ts
import { typography } from './tokens';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

export function fontFamily(weight: Weight = 'regular'): string {
  return typography.fontFamily[weight];
}

export const text = {
  regular:  { fontFamily: typography.fontFamily.regular },
  medium:   { fontFamily: typography.fontFamily.medium },
  semibold: { fontFamily: typography.fontFamily.semibold },
  bold:     { fontFamily: typography.fontFamily.bold },
} as const;
```

### 2. Cargar las fuentes en `app/_layout.tsx`

Modificar el root layout:

```tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

function StatusBarWithTheme() {
  const { theme } = useTheme();
  return <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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

### 3. Validar visualmente en `app/index.tsx`

```tsx
import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { text } from '@/theme/typography';

export default function Index() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, gap: 8 }}>
      <Text style={[text.regular,  { color: theme.colors.textPrimary, fontSize: 16 }]}>Inter Regular</Text>
      <Text style={[text.medium,   { color: theme.colors.textPrimary, fontSize: 16 }]}>Inter Medium</Text>
      <Text style={[text.semibold, { color: theme.colors.textPrimary, fontSize: 16 }]}>Inter SemiBold</Text>
      <Text style={[text.bold,     { color: theme.colors.textPrimary, fontSize: 22 }]}>Inter Bold</Text>
    </View>
  );
}
```

## Validación

- En Expo Go las 4 líneas se ven con **diferente peso visual**, no todas iguales (eso indicaría que cargó el system font fallback)
- No hay flash de fuente del sistema antes de Inter (el splash screen se mantiene hasta que cargan)
- `npx tsc --noEmit` sin errores

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [01.03] 2026-MM-DD — Carga de fuentes Inter
- ✅ `@expo-google-fonts/inter` integrado, 4 pesos (400/500/600/700) cargados en `_layout.tsx`
- ✅ Splash screen permanece hasta que terminan de cargar
- ✅ Helper `theme/typography.ts` con `fontFamily()` y objeto `text`
- 📁 Tocados: `app/app/_layout.tsx`, `app/theme/typography.ts`, `app/app/index.tsx`
- 🧪 Verificación: 4 textos en pantalla con pesos visualmente distintos
```

### Update `STATE.md`
- **Último módulo completado:** 03-fonts-inter
- **Próximo módulo a ejecutar:** prompts/01-fase-auth/04-supabase-client.md
