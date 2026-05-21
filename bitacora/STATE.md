# Estado actual del proyecto WallaTeam

**Última actualización:** 2026-05-06 (máquina: notebook)
**Fase activa:** 06-fase-balance
**Último módulo completado:** 06.05 — Empty states y edge cases
**Próximo módulo a ejecutar:** `prompts/06-fase-balance/06-validar-mock.md`

> 🔀 **Decisión paralela en curso (2026-05-05):** preparar APK alfa para pruebas internas en familia con la app actual (control de gastos personal). Los pasos de EAS Build, perfil `preview` y firma del APK se documentarán al ejecutarlos.

## ⚠️ SQL pendiente de aplicar en Supabase Dashboard

Antes de probar en Expo Go o de generar el APK alfa, aplicar **todo** lo siguiente en orden:
1. `app/supabase/invites_rpc.sql` (RPCs `get_invite_preview` + `accept_wallet_invite`)
2. `app/supabase/policies.sql` (policy `exp_insert` actualizada para soportar paid_by != auth.uid)
3. `app/supabase/incomes_migration.sql` (`alter table expenses add column kind`)
4. `app/supabase/expenses_rpc.sql` (parámetro `p_kind` en `create_expense_with_split`)
5. `app/supabase/expenses_rpc_v2.sql` (jsonb splits — Fase 5)
6. `app/supabase/profiles_rls_fix.sql` (perfiles públicos para que se lean nombres de otros miembros)
7. `app/supabase/balance_migration.sql` (agrega `'settlement'` al check de `expenses.kind`)

---

## Para retomar (desde cualquier máquina o agente nuevo)

1. Leer [`prompts/00-AGENT-HANDOFF.md`](../prompts/00-AGENT-HANDOFF.md)
2. Leer [`prompts/00-MASTER.md`](../prompts/00-MASTER.md)
3. Leer este archivo (ya lo estás haciendo)
4. Leer [`bitacora/CHANGELOG.md`](CHANGELOG.md) (historial)
5. Leer [`bitacora/TASKS.md`](TASKS.md) (qué está en curso/pendiente)
6. Leer [`bitacora/DECISIONS.md`](DECISIONS.md) (ADRs)
7. Abrir el archivo apuntado por **Próximo módulo a ejecutar** y ejecutarlo
8. Al terminar el módulo, actualizar este archivo + CHANGELOG + TASKS

## Snapshot del progreso global

| Fase | Estado | Módulos done |
|---|---|---|
| 01 — Auth | ✅ Cerrada | 7 / 7 |
| 02 — Wallets personales | ✅ Cerrada | 7 / 7 |
| 03 — Gastos | ✅ Cerrada | 7 / 7 |
| 04 — Equipo | ✅ Cerrada | 7 / 7 |
| 05 — Splits | ✅ Cerrada | 7 / 7 |
| 06 — Balance | 🟡 En curso | 5 / 7 |
| 07 — Multimoneda | ⚪ Pendiente | — |
| 08 — Extras | ⚪ Pendiente | — |

## Notas del momento

- **Fase 3 (Gastos) completa**: CRUD expenses funcional, ExpenseRow, CategoryPicker, WalletPickerSheet, edición y eliminación con ConfirmDeleteSheet, métricas reactivas (gastado/restante/usedPct), over-budget en warning amarillo, useTotalBalance con datos reales en Home
- **Polish 2026-05-05**: formato `fmtGs` sin abreviaciones M/k en toda la app (ADR-012). Wallets personales ahora soportan ingresos (kind='income') con flujo cuenta bancaria — saldo = initial + ingresos − gastos (ADR-013). FAB del Wallet Detail en personal abre TransactionTypeSheet (Gasto / Cargar saldo). WalletRow muestra balance actual real, no `initial_balance` fijo.
- Project Supabase activo: `azfcmdihftxtiwrvcfsh.supabase.co`
- Confirm email **OFF en dev** (re-activar antes de release a prod)
- Stack en producción: Expo SDK 54 + React 19.1 + RN 0.81.5
- ADR-009 resuelto: `useTotalBalance` y `useWalletMetrics` calculan con expenses reales
- Prompts de Fase 4 creados en `prompts/04-fase-equipo/` (00-overview + 01..06 + 99)

## Plantilla para arrancar Fase 6

```
Empezá Fase 6 (Balance del grupo) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Tareas:
1. Diseñar prompts/06-fase-balance/ siguiendo plantilla de Fases 4 y 5:
   00-overview.md, 01-balance-algorithm.md, 02-balance-store-hook.md,
   03-balance-ui-tab.md, 04-saldar-flow.md (placeholder Fase 6.1 si queda
   fuera de scope), 05-empty-states.md, 06-validate-vs-mock.md, 99-close-phase.md
2. Objetivo funcional: en Wallet Detail tipo team, mostrar tab/sección
   "Balance del grupo" con quién debe a quién, usando algoritmo de
   simplificación de deudas (minimizar transacciones) sobre saldos netos.
   Considerar split_mode 'equal' / 'percent' / 'amount' (todos resueltos
   en Fase 5 — los splits ya están guardados en expense_splits).
3. NO modificar wallets type='personal' — para esas el concepto de balance
   no aplica.

Mocks ground truth:
- design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx (sección
  "Balance del grupo" — quién debe a quién, botón "Saldar")
- design_handoff_wallateam_mvp/lib/screen-saldar.jsx si existe

Recordá: actualizar bitácora al cerrar cada módulo, commit por módulo,
no inventar componentes (reusar Avatar/Chip/IconBox/etc.), microcopy literal es-PY.
```

## Comandos útiles

```bash
cd app
npm install --legacy-peer-deps   # primera vez en cada máquina o tras package.json change
npm start                         # Metro dev server
npm run typecheck                 # tsc --noEmit
```

## Blocker

_(ninguno activo)_
