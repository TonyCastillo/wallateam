# CHANGELOG — WallaTeam

> Registro append-only de cambios por módulo y fase. El más reciente va al final.
> Formato: `## [Fase.Módulo] YYYY-MM-DD — Título` con bullets de qué se hizo + paths tocados + notas.

---

## [00.00] 2026-04-28 — Bootstrap del prompt-pack y bitácora

- ✅ Estructura `prompts/` creada con carpetas para las 8 fases
- ✅ Estructura `bitacora/` creada (STATE, CHANGELOG, TASKS, DECISIONS)
- ✅ Prompts maestros escritos (`00-MASTER.md`, `00-AGENT-HANDOFF.md`)
- ✅ Fase 1 (Auth) prompt-pack completo: overview, 6 módulos, close-phase
- ✅ `.gitignore` y `README.md` raíz creados
- ✅ Repo git inicializado, commit inicial
- 📁 Tocados: `prompts/**/*.md`, `bitacora/**/*.md`, `.gitignore`, `README.md`
- 🧠 Notas: el código de la app (`app/`) aún no se ha scaffoldeado — eso ocurre cuando se ejecute el módulo `01-fase-auth/01-setup-expo.md`

## [01.01] 2026-04-28 — Setup Expo + dependencias
- ✅ `app/` scaffoldeado con `create-expo-app@latest --template blank-typescript` → Expo SDK 54.0.33, React 19.1.0, RN 0.81.5
- ✅ Instaladas (Expo native, vía `expo install`): expo-router 6.0, react-native-safe-area-context, react-native-screens, expo-linking, expo-constants, expo-status-bar, expo-font, expo-linear-gradient, react-native-svg 15.12, react-native-url-polyfill, expo-secure-store, @react-native-async-storage/async-storage, expo-splash-screen
- ✅ Instaladas (JS, vía `npm install --legacy-peer-deps`): @supabase/supabase-js, zustand, react-hook-form, zod, @hookform/resolvers, lucide-react-native, @expo-google-fonts/inter
- ✅ `app.json`: name=WallaTeam, slug=wallateam, scheme=wallateam, userInterfaceStyle=automatic, plugins=[expo-router, expo-font, expo-secure-store], experiments.typedRoutes=true, web.bundler=metro
- ✅ `package.json` main → `expo-router/entry`, agregado script `typecheck`
- ✅ `tsconfig.json`: strict + paths `@/*` → `./*`
- ✅ Estructura: `app/`, `theme/`, `components/`, `lib/`, `stores/`, `schemas/`, `supabase/`, `assets/fonts/`
- ✅ `app/_layout.tsx` minimal (SafeAreaProvider + Stack), `app/index.tsx` placeholder
- ✅ `.env.example` listo
- 📁 Tocados: `app/package.json`, `app/tsconfig.json`, `app/app.json`, `app/app/_layout.tsx`, `app/app/index.tsx`, `app/.env.example`, eliminados `app/App.tsx` y `app/index.ts`
- 🧪 Verificación: `npx tsc --noEmit` sin errores; `npx expo start` arranca Metro en localhost:8081 sin warnings; `expo-doctor` 16/17 OK (1 falló por timeout de red al schema check)
- 🧠 Notas: ver ADR-004 sobre `--legacy-peer-deps`
