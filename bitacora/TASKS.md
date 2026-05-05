# TASKS — WallaTeam

> Backlog vivo. Mover tareas entre secciones a medida que se trabajan.
> Reglas: ≤1 ítem en `En curso` por fase activa. Cuando se cierra fase, todos sus ítems pasan a `Done`.

---

## En curso

- [ ] [Fase 4] 06 — Validación visual contra prototipo (requiere Expo Go + 2 cuentas)

## Pendiente

### Fase 1.5 (deferred)
- [ ] [Fase 1.5] Google OAuth real (config Google Cloud + Supabase OAuth provider)
- [ ] [Fase 1.5] Forgot password real (`supabase.auth.resetPasswordForEmail` + deep link)
- [ ] [Fase 1.5] Re-activar Confirm email en Supabase antes de release a producción

### Fase 4 — Equipo (queda pendiente solo cierre)
- [ ] [Fase 4] 99 — Cerrar fase

### SQL pendiente de aplicar en Supabase Dashboard
- [ ] Correr `app/supabase/invites_rpc.sql` (RPCs `get_invite_preview` + `accept_wallet_invite`)
- [ ] Re-correr `app/supabase/policies.sql` (policy `exp_insert` actualizada para soportar paid_by != auth.uid)
- [ ] Correr `app/supabase/incomes_migration.sql` (alter table expenses add column kind) — polish 2026-05-05
- [ ] Re-correr `app/supabase/expenses_rpc.sql` (parámetro `p_kind` en `create_expense_with_split`) — polish 2026-05-05

### Fases 5-8 (a planificar al cerrar la previa)
- [ ] [Fase 5] Splits (=, %, ₲) con validaciones
- [ ] [Fase 6] Balance del grupo (cálculo deudas, saldar)
- [ ] [Fase 7] Multimoneda (USD, ARS, conversión)
- [ ] [Fase 8] Extras (foto ticket, push notifications, charts)

## Done

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
