# TASKS — WallaTeam

> Backlog vivo. Mover tareas entre secciones a medida que se trabajan.
> Reglas: ≤1 ítem en `En curso` por fase activa. Cuando se cierra fase, todos sus ítems pasan a `Done`.

---



## En curso

- [ ] [Alfa] Generar APK preview con EAS Build para pruebas internas en familia (control de gastos personal MVP)

## Pendiente

### Fase 6 — Balance (en cierre)
- [ ] [Fase 6] 99 — Cerrar fase (smoke test E2E 3 cuentas + commit)

### Fase 8 — Extras (a ejecutar tras cierre de Fase 6)
- [ ] [Fase 8] 01 — Supabase Storage bucket `expense-photos` + RLS + helper de upload
- [ ] [Fase 8] 02 — PhotoPicker en `expense/new.tsx` + upload al guardar
- [ ] [Fase 8] 03 — Thumbnail en `ExpenseRow` + `PhotoViewer` modal
- [ ] [Fase 8] 04 — Hooks `useMonthlyTotals` / `useCategoryTotals`
- [ ] [Fase 8] 05 — Componentes `MonthlyBarChart` + `CategoryDonut`
- [ ] [Fase 8] 06 — Tab Resumen personal con charts
- [ ] [Fase 8] 99 — Smoke test E2E + commit de cierre + marca MVP completo

### Diferidas indefinidamente
- [ ] [Fase 7] Multimoneda (USD, ARS, conversión) — ver `prompts/07-fase-multimoneda/DEFERRED.md`. MVP es PYG-only.
- [ ] [Post-MVP] Push notifications (`expo-notifications` + Edge Function Supabase) — reevaluar tras validación en uso
- [ ] [Post-MVP] Gastos recurrentes (suscripciones/alquileres) — requiere cron Supabase
- [ ] [Fase 1.5] Google OAuth real (config Google Cloud + Supabase OAuth provider)
- [ ] [Fase 1.5] Forgot password real (`supabase.auth.resetPasswordForEmail` + deep link)
- [ ] [Fase 1.5] Re-activar Confirm email en Supabase antes de release a producción

### SQL pendiente de aplicar en Supabase Dashboard
- [ ] Correr `app/supabase/invites_rpc.sql` (RPCs `get_invite_preview` + `accept_wallet_invite`)
- [ ] Re-correr `app/supabase/policies.sql` (policy `exp_insert` actualizada para soportar paid_by != auth.uid)
- [ ] Correr `app/supabase/incomes_migration.sql` (alter table expenses add column kind) — polish 2026-05-05
- [ ] Re-correr `app/supabase/expenses_rpc.sql` (parámetro `p_kind` en `create_expense_with_split`) — polish 2026-05-05
- [ ] Correr `app/supabase/balance_migration.sql` (kind='settlement' en check) — Fase 6
- [ ] Correr `app/supabase/storage_setup.sql` (bucket expense-photos + RLS) — Fase 8.01 (cuando se ejecute)

## Done

- ✅ [Fase 6] 06 — Validación visual contra mock + fixes typecheck (2026-05-20)
- ✅ [Fase 6] 05 — Empty states y edge cases (2026-05-06)
- ✅ [Fase 6] 04 — Flujo "Marcar como saldado" (2026-05-06)
- ✅ [Fase 6] 03 — Tab Resumen UI (2026-05-06)
- ✅ [Fase 6] 02 — Hook useBalance + cache de splits + ExpenseKind a 'settlement' (2026-05-06)
- ✅ [Fase 6] 01 — Algoritmo computeNets + simplifyDebts (2026-05-06)
- ✅ [Fase 6] 00 — Overview + prompt-pack (2026-05-06)

- ✅ [Fase 5] 99 — Cerrar fase (2026-05-05)
- ✅ [Fase 5] 06 — Validación visual Fase 5 (2026-05-05)
- ✅ [Fase 5] 05 — Modo Montos Fijos (₲) (2026-05-05)
- ✅ [Fase 5] 04 — Modo Porcentajes (%) (2026-05-05)
- ✅ [Fase 5] 03 — Modo Partes Iguales (=) (2026-05-05)
- ✅ [Fase 5] 02 — UI Toggle de Modos de Split (2026-05-05)
- ✅ [Fase 5] 01 — Splits Store y Types (2026-05-05)
- ✅ [Fase 5] 00 — Overview y planificación de prompts (2026-05-05)

- ✅ [Fase 4] 99 — Cerrar fase (2026-05-05)

- ✅ [Fase 4] 06 — Validación visual contra prototipo (2026-05-05)
- ✅ [polish] Formato es-PY sin M/k + ingresos en wallet personal (cuenta bancaria MVP) (2026-05-05)
- ✅ [Bootstrap] Crear prompts/ + bitacora/ + Fase 1 completa + git init (2026-04-28)
- ✅ [Fase 1] 01 — Setup Expo + dependencias (2026-04-28)
- ✅ [Fase 1] 02 — Theme tokens + ThemeProvider (2026-04-28)
- ✅ [Fase 1] 03 — Carga de fuentes Inter (2026-04-28)
- ✅ [Fase 1] 04 — Supabase: project, schema, RLS, cliente (2026-04-28)
- ✅ [Fase 1] 05 — Pantalla Login/Registro + auth gate (2026-04-28)
- ✅ [Fase 1] 06 — Validación visual contra prototipo (2026-04-28)
- ✅ [Fase 1] 99 — Cerrar fase (2026-04-28)
- ✅ [Fase 2] 01 — BottomNav + (tabs) layout (2026-04-28)
- ✅ [Fase 2] 02 — Wallet store + queries Supabase (2026-04-28)
- ✅ [Fase 2] 03 — Pantalla Home (2026-04-28)
- ✅ [Fase 2] 04 — Pantalla Crear Wallet (2026-04-29)
- ✅ [Fase 2] 05 — Pantalla Detalle Wallet (2026-04-29)
- ✅ [Fase 2] 06 — Validación visual contra prototipo (consolidada con uso real, 2026-04-29)
- ✅ [Fase 2] 99 — Cerrar fase (consolidada, 2026-04-29)
- ✅ [Fase 3] 01 — Expense store + queries Supabase (2026-04-29)
- ✅ [Fase 3] 02 — ExpenseRow + lista en Detalle (2026-04-29)
- ✅ [Fase 3] 03 — Pantalla Agregar Gasto (2026-04-29)
- ✅ [Fase 3] 04 — Editar y eliminar gastos (2026-05-04)
- ✅ [Fase 3] 05 — Recálculo de métricas (2026-05-04)
- ✅ [Fase 3] 06 — Validación visual contra prototipo (2026-05-04)
- ✅ [Fase 3] 99 — Cerrar fase (2026-05-04)
- ✅ [Fase 4] 01 — CreateWallet: type='team' habilitado (2026-05-04)
- ✅ [Fase 4] 02 — wallet_invites store + RPCs (2026-05-04)
- ✅ [Fase 4] 03 — Pantalla aceptar invitación deep link (2026-05-04)
- ✅ [Fase 4] 04 — Miembros en Detalle Wallet + InviteSheet (2026-05-04)
- ✅ [Fase 4] 05 — paid_by selector en Agregar Gasto (2026-05-04)
