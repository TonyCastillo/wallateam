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

## [01.02] 2026-04-28 — Theme tokens + ThemeProvider
- ✅ `app/theme/tokens.ts` con `colors` (light) y `colorsDark` (dark) idénticos al `WT_THEMES` original
- ✅ `typography` (Inter weights + sizes xs..3xl + line heights), `spacing` (xs..xl), `radius` (sm..full), `shadows` (card/cardHi/ctaPrimary), `gradients.ctaPrimary`
- ✅ `app/theme/ThemeProvider.tsx` con context, hook `useTheme()`, persistencia en `@wt:theme-mode`, modo system/light/dark, listener `Appearance.addChangeListener` para reactividad
- ✅ `app/_layout.tsx` envuelve con ThemeProvider + StatusBarWithTheme
- ✅ `app/index.tsx` valida acceso al tema (muestra primary/secondary/mode)
- 📁 Tocados: `app/theme/tokens.ts`, `app/theme/ThemeProvider.tsx`, `app/app/_layout.tsx`, `app/app/index.tsx`
- 🧪 Verificación: `tsc --noEmit` limpio; Metro arranca sin errores
- 🧠 Notas: ver ADR-006 sobre la relajación del type `Colors` para soportar dual palette light/dark

## [01.03] 2026-04-28 — Carga de fuentes Inter
- ✅ `@expo-google-fonts/inter` integrado en `_layout.tsx` con `useFonts` (4 pesos: 400/500/600/700)
- ✅ `expo-splash-screen` (preventAutoHideAsync + hideAsync tras carga) — evita flash de fuente system
- ✅ Helper `theme/typography.ts` con `text.{regular,medium,semibold,bold}` y `fontFamily(weight)` tipado
- ✅ `index.tsx` muestra los 4 pesos como smoke test visual
- 📁 Tocados: `app/theme/typography.ts`, `app/app/_layout.tsx`, `app/app/index.tsx`
- 🧪 Verificación: `tsc --noEmit` limpio; Metro arranca OK

## [01.04] 2026-04-28 — Supabase: project, schema, RLS, cliente
- ✅ Project Supabase `azfcmdihftxtiwrvcfsh.supabase.co` creado por el usuario
- ✅ `app/.env` con URL + publishable key (gitignored)
- ✅ `app/supabase/schema.sql`: 7 tablas (profiles, currencies, wallets, wallet_members, expenses, expense_splits, wallet_invites) + seed de 4 currencies (PYG/USD/ARS/EUR) + trigger `handle_new_user` que inserta en `profiles` al signup tomando `full_name` de raw_user_meta_data
- ✅ `app/supabase/policies.sql`: RLS habilitada en las 7 tablas + helper `is_wallet_member` (security definer) + policies por tabla (profiles=own, currencies=read-all, wallets=owner|member, wallet_members=member, expenses=member, expense_splits=via expense, invites=invitador|destinatario por email)
- ✅ `app/lib/supabase.ts`: createClient con AsyncStorage adapter (autoRefreshToken, persistSession, detectSessionInUrl=false)
- ✅ `app/lib/format.ts`: `fmtGs`, `fmtGsSigned` (− para neg, + para pos), `fmtGsCompact` (k/M)
- ✅ `app/app/index.tsx`: smoke test que consulta currencies y muestra los formatos PYG
- ✅ Dashboard del usuario: SQLs corridos exitosamente, "Confirm email" desactivado en Auth → Sign In/Up
- 🧪 Verificación: `tsc --noEmit` limpio; smoke test REST API devuelve [ARS, EUR, PYG, USD] (RLS de `currencies_read_all` funciona sin auth)
- 🧠 Notas: ver ADR-007 sobre publishable key vs JWT anon key clásica
