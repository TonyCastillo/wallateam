# 01 — BottomNav + (tabs) layout

## Objetivo
Reemplazar el `app/(app)/index.tsx` placeholder por una estructura `(app)/(tabs)/` con `expo-router` Tabs y un BottomNav custom que matchea `WTBottomNav` del mock (5 items con FAB central elevado).

## Pre-requisitos
- Fase 1 cerrada (auth gate redirige autenticados a `(app)`)

## Contexto necesario
- `prompts/00-MASTER.md` (tokens, microcopy)
- `design_handoff_wallateam_mvp/lib/wallateam-ui.jsx` líneas 249-292 (componente `WTBottomNav` original)
- Doc oficial expo-router: [Tabs API](https://docs.expo.dev/router/advanced/tabs/) — vamos a usar **Tabs personalizado con `tabBar` prop** porque el FAB central elevado no encaja con el Tab nativo

## Tareas

### 1. Eliminar el placeholder actual y armar la estructura `(tabs)`

```bash
cd app/app/(app)
mkdir -p \(tabs\)
mv index.tsx \(tabs\)/home.tsx   # rename, será el Home propiamente
```

Verificar que el `(app)/_layout.tsx` siga siendo un `Stack` simple — los tabs anidados son los que cambian.

### 2. Crear `app/components/Avatar.tsx`

Por ahora solo iniciales sobre fondo de color (avatares reales con foto van Fase 8). Props: `name` (string), `size` (number, default 36), `bg` (string opcional, default `theme.colors.primary`), `ring` (boolean, opcional). Render: `<View>` circular con `<Text>` centrado mostrando hasta 2 letras (primera del primer nombre + primera del segundo si existe). Usar `theme.typography.fontFamily.semibold`.

### 3. Crear `app/components/BottomNav.tsx`

Port de `WTBottomNav` — componente que recibe `active: 'home' | 'activity' | 'add' | 'stats' | 'profile'` y `onPress: (tab) => void`.

Especificaciones visuales (extraer del mock):
- Container: `flexDirection: 'row'`, `backgroundColor: theme.colors.background`, `borderTopWidth: 1`, `borderTopColor: theme.colors.border`, `paddingTop: 8`, `paddingHorizontal: 12`, `paddingBottom: insets.bottom || 12` (usar `useSafeAreaInsets`)
- Items 1, 2, 4, 5: `flex: 1`, columna, gap 4, icon 22px + label 10px medium. Color: `primary` si activo, `textSecondary` si no.
- **Item 3 (FAB central) "+"**: redondeado (`borderRadius: 28`, `width: 56, height: 56`), `marginTop: -22` (sobresale del tab), gradient `135° primary→secondary` con `expo-linear-gradient`, sombra `shadows.ctaPrimary`, ícono `Plus` blanco 24px

Mapeo de íconos lucide:
- `home` → `Wallet` (sí, el primer tab usa el icon wallet en el mock)
- `activity` → `Activity`
- `add` → `Plus` (FAB)
- `stats` → `TrendingUp`
- `profile` → `User`

### 4. Crear `app/app/(app)/(tabs)/_layout.tsx`

```tsx
import { Tabs } from 'expo-router';
import { BottomNav } from '@/components/BottomNav';
import { useRouter, useSegments } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();
  // ...usar Tabs con tabBar={(props) => <BottomNav .../>}
  // mapear el active según segments y manejar el press del FAB para navegar a /create-wallet
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        // Custom tabBar usando BottomNav
        // active key derivada del state.routes[state.index].name
        // Para el FAB, hacer router.push('/create-wallet') en lugar de navigate al tab "add"
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="add" options={{ href: null }} />  {/* hidden screen, FAB no entra a una pantalla "add" */}
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

**Nota crítica:** el FAB no navega a un tab "add" — abre la pantalla **Crear Wallet** (que vive como modal/full-screen route fuera de tabs). El tab "add" se declara con `href: null` para que ocupe el slot visual pero no sea navegable; el press del FAB hace `router.push('/create-wallet')`.

### 5. Crear stubs para los otros 4 tabs

Mientras Home/Profile/etc. no estén implementados, crear pantallas placeholder simples que muestren el nombre del tab centrado:

- `(tabs)/activity.tsx` — "Actividad reciente — Fase 2.x"
- `(tabs)/stats.tsx` — "Resumen — Fase 8"
- `(tabs)/profile.tsx` — "Perfil — Fase 1.5/8" + botón Cerrar sesión movido acá desde el ex-placeholder

Esto evita errores de routing y deja los slots listos para llenar después.

### 6. Crear el placeholder de `app/app/(app)/create-wallet.tsx`

Por ahora solo un `<SafeAreaView>` centrado que diga "Crear wallet — pantalla en módulo 04". Esto permite verificar que el FAB navega bien antes de construir el form completo.

### 7. Actualizar el `home.tsx` placeholder (renombrado del index)

Que muestre solo "Home — pantalla en módulo 03" centrado, con el saludo + email del user (toma de `useAuth().user`). Esto deja la nav verificable sin Home real.

### 8. Verificar que el AuthGate sigue funcionando

`app/_layout.tsx` redirige a `/` cuando hay sesión. Con la nueva estructura, `/` resuelve al primer tab `(tabs)/home`. Test: cerrar app → reabrir → entra al Home con BottomNav visible.

## Validación

Smoke manual en Expo Go:
1. ✅ Login funciona y aterriza en Home con BottomNav abajo
2. ✅ BottomNav visible: 5 slots, FAB central elevado con gradient + sombra
3. ✅ Tap en cada tab cambia la pantalla correctamente (active state cambia)
4. ✅ Tap en el FAB → abre placeholder de Crear Wallet (no navega a un tab "add")
5. ✅ Logout desde Profile vuelve a `/login`
6. ✅ Reabrir app → vuelve al último tab activo (o Home por default)
7. ✅ Dark mode: BottomNav respeta colores
8. ✅ `npx tsc --noEmit` sin errores

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [02.01] 2026-MM-DD — BottomNav + (tabs) layout
- ✅ Estructura `app/(app)/(tabs)/` con expo-router Tabs personalizado
- ✅ Componente `BottomNav` con 5 items + FAB central (gradient 135°, marginTop -22, shadows.ctaPrimary)
- ✅ Componente `Avatar` con iniciales (placeholder hasta Fase 8)
- ✅ Tabs registradas: home, activity, stats, profile (+ "add" hidden con href:null)
- ✅ FAB hace `router.push('/create-wallet')` (no entra a tab)
- ✅ Stubs creados para activity/stats/profile y placeholder create-wallet
- ✅ Logout movido a tab Profile
- 📁 Tocados: `app/app/(app)/(tabs)/_layout.tsx`, `app/app/(app)/(tabs)/{home,activity,stats,profile}.tsx`, `app/app/(app)/create-wallet.tsx`, `app/components/{BottomNav,Avatar}.tsx`
- 🧪 Verificación: nav funciona en Expo Go, FAB abre placeholder
```

### Update `STATE.md`
- **Último módulo completado:** 02.01-tabs-layout
- **Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/02-wallet-store.md
