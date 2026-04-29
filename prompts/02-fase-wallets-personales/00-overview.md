# Fase 2 — Wallets personales · Overview

## Alcance
CRUD completo de **wallets de tipo `personal`** desde la app móvil: pantalla Home con resumen y lista, pantalla Crear Wallet, pantalla Detalle Wallet (placeholder de gastos), y BottomNav navegable. Wallets de tipo `team` (invitaciones, miembros) se difieren a Fase 4.

## Entregables (criterios de done)

Al cerrar esta fase debe poder demostrarse:

1. ✅ Tras login, el usuario aterriza en una **Home con BottomNav** funcional (5 tabs + FAB central elevado)
2. ✅ Home muestra **Balance total** (gradient card) sumando wallets propias del user
3. ✅ Home tiene **Quick actions row**: Gasto / Wallet / Invitar / Saldar (los 3 últimos navegan o muestran placeholder)
4. ✅ Home muestra **lista de wallets** del user con icono coloreado, nombre, chip `PERSONAL`, monto compacto
5. ✅ Tap en quick action **Wallet** o en FAB → navega a pantalla **Crear Wallet** (modal/full-screen)
6. ✅ Crear Wallet: form completo (preview header, type selector solo PERSONAL, nombre con contador, grid 8 íconos, color, moneda PYG default, presupuesto con quick-add chips, toggles opcionales) → crea row en `wallets` table → vuelve al Home
7. ✅ Tap en una wallet de la lista → navega a **Detalle** con header gradient, métricas (presupuesto/gastado/restante con barra), tabs (Gastos/Resumen/Miembros), lista de gastos placeholder ("Todavía no hay gastos")
8. ✅ Pull-to-refresh en Home recarga las wallets desde Supabase
9. ✅ Estados visuales: loading skeleton al cargar, vacío ("No tenés wallets todavía") si no hay rows, error si la query falla
10. ✅ Validación visual contra `lib/screen-home.jsx`, `lib/screen-create-wallet.jsx`, `lib/screen-wallet-detail.jsx`
11. ✅ Bitácora actualizada y commit por módulo

## Pre-requisitos

- ✅ Fase 1 cerrada (auth + theme + Supabase + login funcional)
- Project Supabase con schema y RLS aplicados
- Usuario logueado puede insertar/leer wallets propias (RLS `wallets_insert_own`, `wallets_select_member`)

## Módulos en orden

| # | Módulo | Tiempo estim. | Bloquea siguiente |
|---|---|---|---|
| 01 | [01-tabs-layout.md](01-tabs-layout.md) | 30 min | Sí (todo el flow vive dentro de tabs) |
| 02 | [02-wallet-store.md](02-wallet-store.md) | 35 min | Sí (Home y Crear lo consumen) |
| 03 | [03-screen-home.md](03-screen-home.md) | 60 min | No (Detalle puede arrancar sin Home perfecto) |
| 04 | [04-screen-create-wallet.md](04-screen-create-wallet.md) | 70 min | No (independiente de Detalle) |
| 05 | [05-screen-wallet-detail.md](05-screen-wallet-detail.md) | 50 min | Sí |
| 06 | [06-validate-vs-mock.md](06-validate-vs-mock.md) | 25 min | Sí |
| 99 | [99-close-phase.md](99-close-phase.md) | 10 min | — |

## Mocks ground truth

- **Home**: [`design_handoff_wallateam_mvp/lib/screen-home.jsx`](../../design_handoff_wallateam_mvp/lib/screen-home.jsx)
- **Crear Wallet**: [`design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx`](../../design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx)
- **Detalle Wallet**: [`design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx`](../../design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx) (la sección de balance grupal y miembros se ignora — Fase 4)
- **Primitives**: [`design_handoff_wallateam_mvp/lib/wallateam-ui.jsx`](../../design_handoff_wallateam_mvp/lib/wallateam-ui.jsx) — especialmente `WTBottomNav` (líneas 249-292), `WTAvatar`, `Icon`

## Salida esperada al cerrar fase

- Repo con `app/(app)/(tabs)/` layout y al menos `home.tsx`, `wallets.tsx` (alias o redirect), `create-wallet.tsx` modal, `wallet/[id].tsx` rutas
- Componentes nuevos: `BottomNav`, `Avatar`, `WalletRow`, `BalanceCard`, `QuickActionButton`, `IconBox`
- Store `stores/wallets.ts` con `useWallets` (list, byId, create, update, archive)
- Tipos en `lib/types.ts` o `stores/wallets.ts`
- `bitacora/STATE.md` apuntando a `prompts/03-fase-gastos/00-overview.md`
- Commit final: `feat(wallets-personales): fase 2 - CRUD wallets personales con Home, Crear, Detalle`
