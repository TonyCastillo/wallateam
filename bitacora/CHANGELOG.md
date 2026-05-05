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

## [03.02] 2026-04-29 — ExpenseRow + lista en Detalle Wallet
- ✅ `lib/format.ts`: helper `formatExpenseDate(iso)` con relativos "Hoy · HH:mm" / "Ayer · HH:mm" / "DD MMM YYYY"
- ✅ `components/ExpenseRow.tsx`: row con `IconBox` de la categoría (size 40, bgOpacity 0.15) + descripción 15 sb + "Pagó {Vos|Otro|nombre} · {fecha}" + monto con `−` Unicode (no guion ASCII). Sombra `card` y soporte `onPress` + `onLongPress` (long-press se conecta en 3.04). Comentario inline aclara que el chip de split queda para Fase 5.
- ✅ `components/EmptyExpenses.tsx` actualizado: ahora recibe prop opcional `walletId`. El botón "Agregar gasto" navega con `router.push('/expense/new?walletId=...')` o `/expense/new` si no viene walletId.
- ✅ `wallet/[id].tsx` reorganizado:
  - Subcomponente `ExpensesList` que decide entre 3 vistas: skeleton (3 cards surfaceAlt opacity 0.5 mientras `loading && list.length === 0`) → `EmptyExpenses` (envuelto en ScrollView para soportar pull-to-refresh) → `FlatList` real con gap 8 entre rows y `paddingBottom: 96` para no chocar con el FAB
  - Tap en `ExpenseRow` navega a `/expense/new?expenseId=...` (modo edit, ruta se crea en 3.03/3.04)
  - Removido el `<ScrollView>` que envolvía a TODOS los tabs — ahora cada tab maneja su propio scroll. Esto evita el warning de "VirtualizedList nested inside ScrollView" cuando el tab Gastos usa FlatList.
  - FAB ahora wirea `router.push('/expense/new?walletId=...')` (antes mostraba Alert "Próximamente")
  - Quitado el smoke debug `console.log` del módulo 3.01
- 📁 Tocados: `app/lib/format.ts`, `app/components/ExpenseRow.tsx`, `app/components/EmptyExpenses.tsx`, `app/app/(app)/wallet/[id].tsx`
- 🧪 Verificación: `tsc --noEmit` limpio. Smoke real: tap a una wallet con gastos muestra los `ExpenseRow` ordenados (sort por `occurred_at desc` viene del store), el empty state navega a una ruta que aún no existe (404 hasta 3.03 — esperado).
- 🧠 Notas: las métricas del header siguen siendo placeholder (gastado=0). El recálculo real es módulo 3.05.

## [03.04] 2026-05-04 — Editar y eliminar gastos
- ✅ `expense/new.tsx` detecta `?expenseId=...` → modo edit con `reset()` del form al cargar el gasto
- ✅ AppBar título/subtítulo y CTA cambian según modo (Nuevo/Editar, Guardar gasto/Guardar cambios)
- ✅ `onSubmit` bifurcado: llama `update()` en edit, `create()` en new
- ✅ Campo Wallet bloqueado en modo edit (sin `onPress`)
- ✅ Botón "Eliminar gasto" rojo outline + Trash2, visible solo en edit
- ✅ Nuevo componente `ConfirmDeleteSheet`: bottom sheet con icono danger, título, mensaje y botones Cancelar/Eliminar
- ✅ Confirmación de borrado usa `ConfirmDeleteSheet` en lugar de `Alert.alert` anidado (en edit screen y en long-press del detalle)
- ✅ `ExpenseRow` long-press → Alert action sheet (Editar/Eliminar) → Eliminar abre `ConfirmDeleteSheet`
- 📁 Tocados: `app/app/(app)/expense/new.tsx`, `app/app/(app)/wallet/[id].tsx`, `app/components/ConfirmDeleteSheet.tsx`

## [03.05] 2026-05-04 — Recálculo de métricas con expenses reales
- ✅ `useTotalBalance` actualizado: resta `sum(expenses.amount)` del `initial_balance` por wallet (cierra ADR-009)
- ✅ Nuevo hook `useWalletMetrics(walletId)` en `lib/walletMetrics.ts` → `presupuesto`, `gastado`, `restante`, `usedPct`, `count`, `overBudget`
- ✅ Header del Detalle Wallet usa `useWalletMetrics`; ProgressBar y métricas reactivos a cambios de expenses
- ✅ Texto "% usado" en color `warning` y semibold cuando `overBudget === true`
- ✅ ADR-009 marcado como **Resuelto** en DECISIONS.md
- ✅ Home BalanceCard refleja balance neto de todas las wallets (via `useTotalBalance`)
- 📁 Tocados: `app/stores/wallets.ts`, `app/lib/walletMetrics.ts`, `app/app/(app)/wallet/[id].tsx`, `bitacora/DECISIONS.md`

## [03.06] 2026-05-04 — Validación visual Fase 3
- ✅ Detalle Wallet con expenses: ExpenseRow (IconBox categoría, descripción, "Pagó Vos · fecha", monto Unicode −), FlatList gap 8, paddingBottom 96, skeleton, EmptyExpenses, pull-to-refresh
- ✅ Métricas header reactivas: Gastado = suma real, Restante = presupuesto − gastado, ProgressBar a usedPct, texto "X% usado · días", warning amarillo en over-budget
- ✅ Interactividad: tap → edit precargado, long-press → ActionSheet Editar/Eliminar, FAB con walletId
- ✅ Pantalla Agregar Gasto: AmountInput con máscara, chip PYG, FormRow Descripción/Categoría/Wallet/Fecha/PagadoPor, CategoryPicker sheet, WalletPickerSheet, sección Splits disabled (Fase 5), adjuntar ticket placeholder, CTA bar Cancelar + Guardar gasto
- ✅ Modo Edit: título "Editar gasto", subtítulo "Modificá los datos", CTA "Guardar cambios", Wallet bloqueado, botón Eliminar rojo
- ✅ ConfirmDeleteSheet: pill handle, icono danger, mensaje, botones Cancelar/Eliminar (no Alert nativo)
- ✅ Microcopy 100% literal es-PY verificado contra mock HTML
- ✅ `tsc --noEmit` sin errores
- 🧠 Desviaciones: ninguna estructural. AppBar back usa ChevronLeft 26px en lugar del círculo 36×36 del prototipo (diferencia cosmética menor, se unifica en Fase 8)

## [03.99] 2026-05-04 — Fase 3 (Gastos) cerrada ✅
- Smoke test E2E: creación → header recalcula, edición → update reflejado, long-press eliminar → ConfirmDeleteSheet → header recalcula, force-quit → datos persistidos
- ADR-009 marcado como Resuelto (useTotalBalance y useWalletMetrics con datos reales)
- `tsc --noEmit` limpio, working tree limpio tras commit
- Próxima fase: 04-fase-equipo (wallets type='team', invitaciones, miembros, RLS team)

## [04.01] 2026-05-04 — CreateWallet: type='team' habilitado
- ✅ `lib/types.ts`: nuevos types `WalletMember`, `WalletInvite`, `MemberRole`
- ✅ `stores/wallets.ts.create`: si `type==='team'`, inserta al creador en `wallet_members` con role='admin'
- ✅ `create-wallet.tsx`: selector "En equipo" activo, info card "Vas a poder invitar miembros una vez creada la wallet" cuando team seleccionado
- ✅ Preview header: "1 miembro" (singular) para team
- 📁 Tocados: lib/types.ts, stores/wallets.ts, app/(app)/create-wallet.tsx

## [04.02] 2026-05-04 — wallet_invites store + RPCs
- ✅ `supabase/invites_rpc.sql`: RPC `get_invite_preview(p_code)` (security definer, lookup por código sin RLS) y `accept_wallet_invite(p_code)` (security definer, inserta wallet_member idempotente + marca accepted_at). Policy `inv_update` agregada.
- ✅ `stores/invites.ts`: nuevo store con `byWallet` cache, `fetchByWallet`, `create` (genera invite_code 8 chars alfa-num sin ambiguos, retry 3x si choca unique), `preview` (RPC), `accept` (RPC), `revoke` (set expires_at al pasado)
- 📁 Tocados: app/supabase/invites_rpc.sql, app/stores/invites.ts
- ⚠️ Pendiente: usuario debe correr `invites_rpc.sql` en Supabase Dashboard

## [04.03] 2026-05-04 — Pantalla aceptar invitación (deep link)
- ✅ Ruta `app/(app)/invite/[code].tsx` registrada como modal
- ✅ Flujo: lookup vía `useInvites.preview()` → muestra card con gradient + nombre + ícono + chip Equipo → tap "Unirme al equipo" → `accept()` → fetchAll wallets+expenses → `router.replace('/wallet/{id}')`
- ✅ Estados: loading (spinner), error (vencida/no encontrada con botón Volver), preview válido
- ✅ Microcopy: "Fuiste invitado a unirte a esta wallet", "Unirme al equipo", "Pedile a quien te invitó que te genere un nuevo link"
- 📁 Tocados: app/(app)/invite/[code].tsx, app/(app)/_layout.tsx

## [04.04] 2026-05-04 — Miembros en Detalle Wallet
- ✅ `stores/wallets.ts`: cache `membersByWallet`, action `fetchMembers(walletId)` con join a profiles, selector `membersOf(id)`
- ✅ `components/AvatarStack.tsx`: stack con overlap de hasta N avatares + "+N" overflow
- ✅ `components/InviteSheet.tsx`: bottom sheet que crea invite (expira en 7 días), muestra link `wallateam://invite/CODE`, botones "Copiar link" (`expo-clipboard`) + "Compartir" (Share API nativa)
- ✅ `wallet/[id].tsx`: AvatarStack en titleRow para wallets team, tab Miembros activo con FlatList real (Avatar + nombre + rol Admin/Miembro), header "Invitar" como Pressable dashed
- ✅ Auto-fetch de miembros al entrar al detalle si type='team'
- 📦 Instalado: `expo-clipboard`
- 📁 Tocados: app/stores/wallets.ts, app/components/{AvatarStack,InviteSheet}.tsx, app/(app)/wallet/[id].tsx, app/package.json

## [04.05] 2026-05-04 — paid_by selector en Agregar Gasto
- ✅ `supabase/policies.sql`: relajado `exp_insert` para permitir `paid_by` distinto de `auth.uid()` siempre que sea miembro del wallet
- ✅ `schemas/expense.ts`: campo `paid_by` opcional (uuid)
- ✅ `lib/types.ts`: `NewExpenseInput.paid_by` opcional
- ✅ `stores/expenses.ts.create`: usa `input.paid_by ?? userId`
- ✅ `components/MemberPickerSheet.tsx`: nuevo sheet con lista ordenada (vos primero), avatar, rol, check
- ✅ `expense/new.tsx`: incluye wallets team (`WalletPickerSheet` ya no filtra solo personal), FormRow "Pagado por" tappable cuando `team && >1 miembro`, auto-fetchMembers al cambiar wallet, reset paid_by al user actual cuando wallet es personal
- ✅ Chip "EQUIPO" (secondary) en FormRow Wallet
- 📁 Tocados: app/supabase/policies.sql, app/schemas/expense.ts, app/lib/types.ts, app/stores/expenses.ts, app/(app)/expense/new.tsx, app/components/{MemberPickerSheet,WalletPickerSheet}.tsx
- ⚠️ Pendiente: usuario debe re-correr `policies.sql` en Supabase Dashboard

## [polish] 2026-05-05 — Formato G sin abreviar (Paraguay) + ingresos en wallet personal (MVP cuenta bancaria)

Fix transversal previo al cierre de Fase 4. Dos bloques:

**Bloque 1 — Formato es-PY sin M/k:**
- ✅ Borrada `fmtGsCompact` de `lib/format.ts`. La app ahora usa siempre `fmtGs` → "₲ 7.500.000" en vez de "₲ 7.5M". Razón: usuarios paraguayos no esperan formato de redes sociales en montos financieros (ADR-012).
- ✅ `BalanceCard.tsx`: secciones PERSONAL/EQUIPO bajan a fontSize 14 + `numberOfLines=1` + `adjustsFontSizeToFit minimumFontScale=0.75`; divisor central pasa de 16 a 10 px para dar más espacio.
- ✅ `WalletRow.tsx`: restructurado a layout 2-niveles tipo app bancaria. IconBox + columna middle con (nombre+chip) sobre (balance+disponible). Balance ahora es 17px y muestra el **balance actual real** (initial_balance + ingresos − gastos), no `initial_balance` fijo. Subtítulo "1 miembro" eliminado por redundante con el chip.
- ✅ `wallet/[id].tsx` métricas: pasaron de fila horizontal de 3 columnas a stack vertical (gap 10) — los montos completos no entran en 3 columnas a fontSize 18. En wallets personales se muestran ahora `Saldo actual / Ingresos / Gastos`; en team se mantienen `Presupuesto / Gastado / Restante`. ProgressBar oculta en personales (no aplica "% usado" cuando hay ingresos).
- ✅ `lib/walletMetrics.ts`: añadido helper `useWalletBalance(walletId)` y campos `ingresos` + `saldoActual` a `WalletMetrics`.
- ✅ `stores/wallets.ts → useTotalBalance`: balance por wallet ahora es `initial + sum(income) − sum(expense)`.

**Bloque 2 — Ingresos en wallet personal:**
- ✅ `supabase/incomes_migration.sql` (NUEVO): `alter table expenses add column kind text default 'expense' check (kind in ('expense','income'))` + índice `(wallet_id, kind)`. Idempotente. **Pendiente aplicar en Supabase Dashboard**.
- ✅ `supabase/expenses_rpc.sql`: `create_expense_with_split` agrega parámetro `p_kind text default 'expense'` con validación. **Re-correr en Dashboard**.
- ✅ `lib/types.ts`: nuevo `ExpenseKind = 'expense' | 'income'`. `Expense.kind` y `NewExpenseInput.kind` agregados. `Expense.category` se relaja a `string | null` para soportar el set de income (`INCOME_CATEGORIES`) sin un union type que crezca por cada feature.
- ✅ `lib/categories.ts`: nuevas `IncomeCategoryId`, `INCOME_CATEGORIES` (Salario, Freelance, Regalo, Otro), helpers `incomeCategoryById` y `anyCategoryById(id, kind)` para callers que renderizan ambos tipos.
- ✅ `stores/expenses.ts`: `normalizeExpense` defaultea `kind` a 'expense' si Postgres lo manda undefined; `create` propaga `p_kind` al RPC; `totals` ahora retorna `{ spent, income, count }` separados por kind.
- ✅ `schemas/expense.ts`: `kind` requerido en el schema (default vive en `defaultValues` del form para que input/output type del Resolver sean iguales). `category` se relaja a `z.string().min(1)` por mismo motivo de set dual.
- ✅ `expense/new.tsx`: nuevo toggle Gasto/Ingreso (segmented control) renderizado solo en wallets personales y solo en modo create. Income switchea CategoryPicker al set de incomes, pinta el card de monto y label en accent verde, oculta la sección "Cómo dividir" (no aplica), y cambia el copy del CTA a "Cargar saldo". Acepta `?kind=expense|income` en query params para invocación desde el FAB. En wallets team el `kind` se fuerza a 'expense'.
- ✅ `components/CategoryPicker.tsx`: prop `kind` opcional para alternar entre `CATEGORIES` e `INCOME_CATEGORIES`.
- ✅ `components/ExpenseRow.tsx`: usa `anyCategoryById` para resolver icon. Renderiza `+ ₲ X` en accent verde para income, `− ₲ X` en textPrimary para expense. Verbo "Cargó" / "Pagó" según kind.
- ✅ `components/TransactionTypeSheet.tsx` (NUEVO): bottom sheet con dos opciones (Nuevo gasto / Cargar saldo). Reusa el patrón visual de `ConfirmDeleteSheet`.
- ✅ `wallet/[id].tsx`: en wallets personales el FAB abre `TransactionTypeSheet`; en team mantiene navegación directa a `/expense/new`. `useWalletMetrics` se desestructura con los nuevos campos.

**Bitácora:**
- ✅ ADR-012 (Formato es-PY) y ADR-013 (Columna `kind` en expenses) en DECISIONS.md.
- ✅ TASKS.md: agregada la migración SQL pendiente.
- ✅ STATE.md actualizado.

📁 **Tocados:** app/lib/{format,types,categories,walletMetrics}.ts, app/stores/{expenses,wallets}.ts, app/components/{BalanceCard,WalletRow,ExpenseRow,CategoryPicker,TransactionTypeSheet}.tsx, app/app/(app)/{expense/new,wallet/[id]}.tsx, app/schemas/expense.ts, app/supabase/{incomes_migration.sql,expenses_rpc.sql}, bitacora/{STATE,CHANGELOG,TASKS,DECISIONS}.md.

🧪 **Verificación:** `npm run typecheck` limpio. Validación visual y end-to-end (cargar sueldo + gasto + edit + delete) pendiente — requiere aplicar SQL en Dashboard primero.

⚠️ **Pendiente al usuario:** correr `supabase/incomes_migration.sql` y re-correr `supabase/expenses_rpc.sql` en Supabase Dashboard antes de probar en Expo Go.

## [04.06] 2026-05-05 — Validación visual Fase 4
- ✅ CreateWallet team: 4/4 items
- ✅ Detalle Wallet team (header, tab Miembros, invite): 5/5 items
- ✅ Agregar Gasto paid_by: 4/4 items
- ✅ Pantalla invitación: 5/5 items
- ✅ Microcopy: 10/10 literal
- 🧠 Desviaciones: ninguna. Se hicieron ajustes menores en el código para matchear 100% el microcopy exigido (Owner vs Admin, copys exactos de los links de invitación).
- 📁 Tocados: `app/app/(app)/create-wallet.tsx`, `app/app/(app)/wallet/[id].tsx`, `app/components/InviteSheet.tsx`, `app/components/MemberPickerSheet.tsx`
