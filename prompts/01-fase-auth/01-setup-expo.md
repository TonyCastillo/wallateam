# 01 — Setup proyecto Expo + dependencias

## Objetivo
Crear el scaffold inicial del proyecto Expo con TypeScript strict, expo-router, y todas las dependencias necesarias para Fase 1.

## Pre-requisitos
- `prompts/00-MASTER.md` y `00-AGENT-HANDOFF.md` leídos
- Node 20+ instalado (`node -v`)
- Working directory: `f:/proyectos_2026/WallaTeam/WallaTeam/`

## Contexto necesario
- `prompts/00-MASTER.md` sección 2 (stack confirmado)
- `design_handoff_wallateam_mvp/README.md` sección "Stack recomendado" y "Checklist mínimo"

## Tareas

### 1. Crear el proyecto Expo
Desde `f:/proyectos_2026/WallaTeam/WallaTeam/`:

```bash
npx create-expo-app@latest app --template blank-typescript
```

Esto crea `app/` con TS configurado.

### 2. Instalar dependencias core

```bash
cd app
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-font expo-linear-gradient react-native-svg react-native-url-polyfill expo-secure-store @react-native-async-storage/async-storage
```

### 3. Instalar dependencias JS

```bash
npm install @supabase/supabase-js zustand react-hook-form zod @hookform/resolvers lucide-react-native @expo-google-fonts/inter
```

### 4. Configurar `app.json` para expo-router

Editar `app.json` y asegurarte de tener:
- `"scheme": "wallateam"`
- `"plugins": ["expo-router"]`
- `"experiments": { "typedRoutes": true }`
- En `"web"` agregar `"bundler": "metro"`

### 5. Cambiar `package.json` main entry

```json
"main": "expo-router/entry"
```

### 6. Habilitar TS strict y paths

Editar `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### 7. Borrar entry antiguo y crear estructura expo-router

```bash
rm -f App.tsx index.ts
mkdir -p app theme components lib stores schemas supabase assets/fonts
```

Crear `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
```

Crear `app/index.tsx` placeholder:

```tsx
import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>WallaTeam — placeholder root</Text>
    </View>
  );
}
```

### 8. Crear `.env.example`

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### 9. Crear `.gitignore` específico (si no existe en el repo raíz aún)

```
node_modules/
.expo/
dist/
web-build/
.env
*.log
.DS_Store
```

## Validación

```bash
npx expo start --clear
```

Resultados esperados:
- ✅ Compila sin errores
- ✅ Abre QR code en terminal
- ✅ Escaneando con Expo Go se ve "WallaTeam — placeholder root" centrado en pantalla
- ✅ `npx tsc --noEmit` no produce errores

Si falla por incompatibilidad de versiones, correr `npx expo install --check`.

## Cierre

### Entry para `bitacora/CHANGELOG.md`
```markdown
## [01.01] 2026-MM-DD — Setup Expo + dependencias
- ✅ `app/` creado con `create-expo-app` + template blank-typescript
- ✅ Instaladas: expo-router, supabase-js, zustand, react-hook-form, zod, lucide-react-native, react-native-svg, expo-linear-gradient, expo-font, @expo-google-fonts/inter, AsyncStorage
- ✅ TS strict + paths `@/*` configurado
- ✅ `app/_layout.tsx` con SafeAreaProvider + Stack
- 📁 Tocados: `app/package.json`, `app/tsconfig.json`, `app/app.json`, `app/app/_layout.tsx`, `app/app/index.tsx`, `app/.env.example`
- 🧪 Verificación: `npx expo start` arranca, Expo Go muestra placeholder
```

### Update `bitacora/STATE.md`
- **Último módulo completado:** 01-setup-expo
- **Próximo módulo a ejecutar:** prompts/01-fase-auth/02-theme-tokens.md

### Mover en `bitacora/TASKS.md`
- `[Fase 1] 01 — Setup Expo` → de "En curso" a "Done"
- `[Fase 1] 02 — Theme tokens` → de "Pendiente" a "En curso"
