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

## [01.05] 2026-04-28 — Pantalla Login/Registro + auth gate
- ✅ `schemas/auth.ts`: zod loginSchema (email + password ≥8 + 1 número) y signupSchema (extiende con fullName 2-60)
- ✅ `stores/auth.ts`: Zustand con session/user/hydrated, `hydrate()` (getSession + onAuthStateChange listener), `signOut()`
- ✅ `components/Icon.tsx`: wrapper `lucide-react-native` con strokeWidth=1.8 default
- ✅ `components/WTLogo.tsx`: port SVG de wallateam-ui.jsx con `react-native-svg` (Rect, Path, Circle, LinearGradient con id único por instancia via useId)
- ✅ `components/RadialHero.tsx`: gradient radial top con `react-native-svg` (`expo-linear-gradient` no soporta radial)
- ✅ `components/Input.tsx`: WTField port. Label uppercase 11px sb 0.3 letterSpacing, box surface 12px borderRadius gap 10, trailing slot opcional, error message debajo
- ✅ `components/Button.tsx`: variant primary (LinearGradient 135° primary→secondary, shadow ctaPrimary, icon left/right, loading state) + outline (border + bg)
- ✅ `(auth)/_layout.tsx` y `(auth)/login.tsx`: pantalla completa con tabs Ingresar/Registrarme, RadialHero fondo, WTLogo 68px, título Walla(secondary)+Team(primary) bold 26 letterSpacing -0.5, tagline, form Controller+zod (3 campos en signup), eye toggle (Eye/EyeOff), forgot password placeholder, CTA gradient con arrow-right, divider "o continuar con", Google placeholder con Alert, switch tab footer
- ✅ `(app)/_layout.tsx` y `(app)/index.tsx`: placeholder home con saludo `Hola, {fullName}` y botón rojo "Cerrar sesión" → `useAuth().signOut()`
- ✅ Root `_layout.tsx`: `useFonts` Inter, `useAuth().hydrate()` al mount, `AuthGate` redirige según `session` y `segments[0]==='(auth)'` con `router.replace()`
- 🗑️ Borrado `app/index.tsx` (conflicto con `(app)/index.tsx`)
- ⚙️ `app.json`: `experiments.typedRoutes=false` (quirk de versión que no expone bare `/`, ver ADR-008)
- 📁 Tocados: `app/schemas/auth.ts`, `app/stores/auth.ts`, `app/components/{Icon,WTLogo,RadialHero,Input,Button}.tsx`, `app/(auth)/_layout.tsx`, `app/(auth)/login.tsx`, `app/(app)/_layout.tsx`, `app/(app)/index.tsx`, `app/_layout.tsx`, `app.json`
- 🧪 Verificación: `tsc --noEmit` limpio; Metro arranca cargando `.env` correctamente. Validación visual + flow E2E (signup → home → logout → login → reabrir) en módulo 1.06.
- 🧠 Notas: zodResolver(schema) requiere `as unknown as Resolver<SignupInput>` porque cuando tab='login' el schema no tiene fullName (solo está en signup). Defaults siempre incluyen fullName='' y se ignora en login.

## [01.06] 2026-04-28 — Validación visual + E2E
- ✅ Usuario probó la app en Expo Go con el flow completo (signup → home → logout → login → reabrir → sigue logueado)
- ✅ Confirmación visual: pantalla matchea el prototipo HTML (logo 68px, tipografía Inter, tabs, gradient CTA, eye toggle, divider, microcopy es-PY)
- ✅ Microcopy 100% literal contra el mock
- ✅ AuthGate redirige correctamente según session
- ✅ Persistencia de sesión funciona vía AsyncStorage (force-quit + reopen mantiene login)
- 🧠 Notas: la validación lado a lado contra `WallaTeam Prototype.html` se delega al usuario en futuras revisiones. Sin desviaciones reportadas en esta primera pasada.

## [01.99] 2026-04-28 — Fase 1 (Auth) cerrada ✅
- Smoke test E2E pasado por el usuario en dispositivo real
- Commit de cierre `feat(auth)[01.99]: cierre fase 1`
- Próxima fase: 02-fase-wallets-personales (a planificar/diseñar prompts antes de ejecutar)

## [02.01] 2026-04-28 — BottomNav + (tabs) layout
- ✅ Estructura `app/(app)/(tabs)/` con expo-router Tabs personalizado
- ✅ Componente `BottomNav` con 5 items + FAB central (gradient 135°, marginTop -22, shadows.ctaPrimary)
- ✅ Componente `Avatar` con iniciales (placeholder hasta Fase 8)
- ✅ Tabs registradas: home, activity, stats, profile (+ "add" hidden con href:null)
- ✅ FAB hace `router.push('/create-wallet')` (no entra a tab)
- ✅ Stubs creados para activity/stats/profile y placeholder create-wallet
- ✅ Logout movido a tab Profile
- 📁 Tocados: `app/app/(app)/(tabs)/_layout.tsx`, `app/app/(app)/(tabs)/{home,activity,stats,profile}.tsx`, `app/app/(app)/create-wallet.tsx`, `app/components/{BottomNav,Avatar}.tsx`
- 🧪 Verificación: nav funciona en Expo Go, FAB abre placeholder
