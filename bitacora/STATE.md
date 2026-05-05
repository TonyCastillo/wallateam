# Estado actual del proyecto WallaTeam

**Última actualización:** 2026-05-05 (máquina: notebook)
**Fase activa:** 05-fase-splits
**Último módulo completado:** 05-split-amount-mode
**Próximo módulo a ejecutar:** [prompts/05-fase-splits/06-split-validation-smoke-test.md](../prompts/05-fase-splits/06-split-validation-smoke-test.md)

## ⚠️ SQL pendiente de aplicar en Supabase Dashboard
- [ ] Correr `app/supabase/expenses_rpc_v2.sql` (actualiza RPC para aceptar JSON array de splits)

Antes de probar en Expo Go:
1. Correr `app/supabase/invites_rpc.sql` (RPCs `get_invite_preview` + `accept_wallet_invite`)
2. Re-correr `app/supabase/policies.sql` (policy `exp_insert` actualizada)
3. **Nuevo (polish 2026-05-05):** correr `app/supabase/incomes_migration.sql` (`alter table expenses add column kind`) y re-correr `app/supabase/expenses_rpc.sql` (parámetro `p_kind`)

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
| 05 — Splits | 🟡 En curso | 5 / 7 |
| 06 — Balance | ⚪ Pendiente | — |
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

## Plantilla para arrancar Fase 4

```
Empezá Fase 4 (Equipo) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md
4. prompts/04-fase-equipo/00-overview.md

Mocks ground truth:
- design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx (sección "Miembros" para type='team')
- design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx (avatares overlap, balance del grupo, tab Miembros)

Ejecutar el módulo apuntado por STATE.md → Próximo módulo a ejecutar.

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
