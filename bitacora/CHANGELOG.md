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

## [02.02] 2026-04-28 — Wallet store + queries Supabase
- ✅ `lib/types.ts` con `Wallet`, `WalletType`, `WalletIcon`, `NewWalletInput`
- ✅ `lib/walletIcons.ts` con catálogo de 8 íconos (id, lucide, color, label)
- ✅ `stores/wallets.ts` Zustand: `wallets`, `loading`, `error`, `fetchAll`, `fetchById`, `create`, `archive`, `byId` selector
- ✅ Hook `useTotalBalance` (placeholder hasta Fase 3 — usa initial_balance, no balance real)
- ✅ Hidratación al login en root `_layout.tsx`
- ✅ Realtime subscription al channel `wallets-changes`
- ✅ Wallets dummy listos para ser insertadas para validación
- 📁 Tocados: `app/lib/types.ts`, `app/lib/walletIcons.ts`, `app/stores/wallets.ts`, `app/app/_layout.tsx`, `app/app/(app)/(tabs)/home.tsx` (smoke test)
- 🧪 Verificación: home placeholder muestra wallets en JSON debug
- 🧠 Notas: ver DECISIONS.md sobre useTotalBalance placeholder y realtime simple

## [02.03] 2026-04-28 — Pantalla Home (wallets personales)
- ✅ Componentes: IconBox (con helper withAlpha), Chip (primary/secondary tones), BalanceCard (gradient secondary→primary), QuickAction (filled/subtle), WalletRow, SectionHeader
- ✅ Pantalla `(tabs)/home.tsx` completa: top bar + BalanceCard + 4 quick actions + Mis wallets list + Actividad placeholder
- ✅ Pull-to-refresh con RefreshControl
- ✅ Empty state con CTA "Crear mi primera wallet"
- ✅ Skeleton loading rows
- 📁 Tocados: `app/components/{IconBox,Chip,BalanceCard,QuickAction,WalletRow,SectionHeader}.tsx`, `app/app/(app)/(tabs)/home.tsx`
- 🧪 Verificación: lista de wallets dummy se ve correctamente, navegación a Crear/Detalle funciona

## [02.04] 2026-04-29 — Pantalla Crear Wallet (personal)
- ✅ Schema zod `schemas/wallet.ts` con `newWalletSchema`
- ✅ Pantalla `(app)/create-wallet.tsx` con AppBar, preview header gradient en vivo, type selector (personal activo, team disabled), nombre con counter, grid 8 íconos, color picker 8 swatches, moneda PYG, presupuesto con quick-add chips (+100k +500k +1M +5M), opciones avanzadas collapsible (target_date con DatePicker, budget_alert_pct, is_private)
- ✅ Componente reutilizable `ToggleRow` para opciones avanzadas
- ✅ DatePicker integrado vía `@react-native-community/datetimepicker`
- ✅ `(app)/_layout.tsx`: route `create-wallet` registrada con `presentation: 'modal'` + `wallet/[id]`
- ✅ `Input.tsx` actualizado: `iconName` opcional + prop `labelTrailing` para counter
- ✅ onSubmit llama `useWallets.getState().create()` y vuelve al Home
- 📁 Tocados: `app/schemas/wallet.ts`, `app/app/(app)/create-wallet.tsx`, `app/app/(app)/_layout.tsx`, `app/components/{ToggleRow,Input}.tsx`
- 🧪 Verificación: crear wallet → aparece en Home; cancelar → no se inserta; validaciones funcionan

## [02.05] 2026-04-29 — Pantalla Detalle de Wallet
- ✅ Componentes nuevos: `Tabs` (underline-style con borderBottom 2px primary en activo), `ProgressBar` (clamping 0..1, tint+bg parametrizables), `Metric` (label uppercase + value, props `labelColor`/`valueColor` para uso sobre gradient header), `EmptyExpenses` (IconBox Receipt + microcopy "Todavía no hay gastos" / "Cuando agregues un gasto aparecerá acá" + Button outline "Agregar gasto" con Alert)
- ✅ Pantalla `app/(app)/wallet/[id].tsx` completa:
  - Header gradient `[wallet.color, secondary]` 135° con borderBottomRadius 24, paddingTop con safe area
  - Top row con ChevronLeft (back) + Settings (Alert "Próximamente")
  - Title row: ícono 56px sobre bg blanco@20% + nombre 22px bold blanco + chip "Personal"/"Equipo" custom (bg blanco@20%)
  - Métricas row: Presupuesto / Gastado / Restante (highlight=accent), todas en blanco con label@70%
  - ProgressBar blanco sobre blanco@20% + texto "0% usado · {N días restantes | sin fecha objetivo}"
  - Tabs underline: Gastos (activo), Resumen (placeholder Fase 8), Miembros (disabled si type='personal')
  - Tab Gastos → `<EmptyExpenses />`; Resumen y Miembros → placeholders microcopy
  - FAB inferior derecho (color de la wallet) con Alert "Próximamente — Fase 3"
- ✅ Loading state: `<ActivityIndicator />` mientras `byId` es undefined y `fetchById` resuelve
- ✅ Error state: si `fetchById` retorna null → Alert "Wallet no encontrada" con back automático
- ✅ Helper `resolveLucideIcon(walletIcon)` con fallback al ícono `Wallet` cuando `wallet.icon='wallet'` (no está en el catálogo de 8)
- 📁 Tocados: `app/components/{Tabs,ProgressBar,Metric,EmptyExpenses}.tsx`, `app/app/(app)/wallet/[id].tsx`
- 🧪 Verificación: `tsc --noEmit` limpio; Metro arranca cargando `.env`. Validación visual end-to-end queda para módulo 02.06.
- 🧠 Notas: gastado=0 / restante=initial_balance hasta Fase 3 (consistente con ADR-009 — `useTotalBalance` ya hacía lo mismo).

## [03.01] 2026-04-29 — Expense store + queries Supabase
- ✅ `lib/categories.ts`: catálogo cerrado de 8 categorías con `id`, `label`, `icon` (lucide), `color`. Helper `categoryById` con fallback a 'other'
- ✅ `lib/types.ts` extendido: `Expense`, `ExpenseSplit`, `SplitMode`, `NewExpenseInput`. Import de `CategoryId` para tipado de `expense.category`
- ✅ `supabase/expenses_rpc.sql`: función `create_expense_with_split` (security invoker, atomic insert expense + split) — el usuario la corrió en el dashboard
- ✅ `stores/expenses.ts` Zustand: cache `byWallet: Record<string, Expense[]>`, `loading`, `error`. Acciones `fetchAll` (agrupa por wallet_id) / `fetchByWallet` / `create` (vía `supabase.rpc('create_expense_with_split', ...)`) / `update` (sincroniza split.amount si cambia el monto) / `remove` (cascade FK borra split). Selectores `list(walletId)` y `totals(walletId)`. Helper `normalizeExpense` que castea `amount` a Number (Postgres numeric viene como string en JSON).
- ✅ Realtime subscription al canal `expenses-changes` con setup-once pattern (igual que wallets)
- ✅ `_layout.tsx` hidrata `useExpenses.fetchAll()` al login junto con wallets
- ✅ Smoke debug temporal en `wallet/[id].tsx`: `console.log('[expenses smoke]', id, count, spent)` se elimina en 3.02
- ✅ Usuario insertó gasto manual de prueba (₲ 150.000 categoría food). Smoke test confirma: la consola imprime el count y spent correctos.
- 📁 Tocados: `app/lib/categories.ts`, `app/lib/types.ts`, `app/stores/expenses.ts`, `app/supabase/expenses_rpc.sql`, `app/app/_layout.tsx`, `app/app/(app)/wallet/[id].tsx`
- 🧪 Verificación: `tsc --noEmit` limpio, Metro arranca, smoke test imprime data correcta. UI sin cambios visibles (eso llega en 3.02).
- 🧠 Notas: ver ADR-011 sobre RPC atómico vs queries separadas
