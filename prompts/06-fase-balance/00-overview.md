# Fase 6 — Balance del grupo

## Objetivo
En wallets `type='team'`, mostrar **quién debe a quién** y minimizar la cantidad de transferencias necesarias para que todos queden en cero. Habilitar también la acción "Marcar como saldado" para registrar transferencias entre miembros que cancelen deudas.

## Mocks ground truth
- `design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx` — sección "Balance del grupo" con `BalanceLine` (avatar + nombre + monto signed verde/rojo + status "te deben"/"debés"). El mock lo ubica en el header como card siempre visible; nosotros lo ponemos dentro de la **tab "Resumen"** (decisión 2026-05-05) reusando el placeholder existente.

## Decisiones tomadas
- **Ubicación UI:** tab "Resumen" del Wallet Detail (hoy es placeholder "Próximamente — Fase 8"). Se llena con 3 secciones: tu saldo neto destacado, lista de saldos por miembro, lista de transferencias minimizadas. Sin agregar tabs nuevas.
- **Saldar in-scope:** sí — botón "Marcar como saldado" entra en Fase 6 (no se difiere a 6.1).
- **Modelo de datos para "saldar":** se agrega `kind='settlement'` a la tabla `expenses` (alongside 'expense' / 'income'). Una settlement de A → B por ₲ X se registra como expense con `paid_by=A`, single split `user_id=B, amount=X`, `kind='settlement'`. Matemáticamente equivalente a un expense regular, pero filtrado del listado de gastos del grupo y mostrado en sección propia. Aprovecha toda la infra existente (RLS, RPC, store, realtime).
- **Algoritmo:** greedy clásico (acreedor mayor + deudor mayor → transferir min, repetir). Para grupos <10 miembros produce resultado óptimo o casi-óptimo. Optimal matching es NP-hard y no se justifica para este uso.
- **Solo aplica a `type='team'`:** wallets `personal` no tienen concepto de balance entre miembros.
- **Currency:** solo PYG (multimoneda es Fase 7). El algoritmo opera sobre `amount: number` neutro respecto a moneda.

## Algoritmo (resumen)
```
saldo neto por miembro:
  net[U] = Σ(amount donde paid_by=U)  -  Σ(split.amount donde split.user_id=U)
  (kind 'expense' y 'settlement' contribuyen igual; 'income' se ignora — no aplica a team)

simplifyDebts(net):
  acreedores = miembros con net > 0 ordenados desc
  deudores   = miembros con net < 0 ordenados asc
  transferencias = []
  while acreedores y deudores no vacíos:
    a = acreedores[0]; d = deudores[0]
    monto = min(a.net, |d.net|)
    transferencias.push({ from: d.user_id, to: a.user_id, amount: monto })
    a.net -= monto; d.net += monto
    sacar a/d si quedaron en 0
  return transferencias
```

## Módulos

| # | Nombre | Descripción breve |
|---|---|---|
| 01 | balance-algorithm | `app/lib/balance.ts` con `computeNets()` y `simplifyDebts()`. Funciones puras testeables. |
| 02 | balance-hook | `useBalance(walletId)` en `app/lib/balance.ts` que conecta wallets/expenses stores y retorna `{netByUser, transfers, isSettled}`. |
| 03 | balance-ui | Tab "Resumen" del Wallet Detail muestra 3 secciones usando `BalanceLine` y `TransferLine`. Solo wallets team. |
| 04 | saldar-flow | SQL migration kind='settlement' + actualizar RPC + `SaldarSheet` con prefill (deudor → acreedor, monto sugerido) + insert vía store. |
| 05 | empty-states | Edge cases: 1 solo miembro, sin gastos, todos en cero (post-saldar), wallet personal (no muestra tab). |
| 06 | validate-vs-mock | Checklist contra `screen-wallet-detail.jsx` (`BalanceLine` styling + microcopy "te deben"/"debés" + colores accent verde / danger rojo). |
| 99 | close-phase | Smoke test E2E (3 miembros, gastos cruzados, ver balance, saldar, ver cero), commit de cierre, plantilla Fase 7. |

## Stack a usar
- TypeScript puro para el algoritmo (cero dependencias nuevas).
- Reusar `Avatar`, `IconBox`, `Sheet` (patrón ConfirmDeleteSheet).
- Zustand selectors derivados (no nuevo store — el algoritmo es función pura sobre los stores existentes).

## Supabase
- 1 migración nueva: `app/supabase/balance_migration.sql` (alter `expenses_kind_check` para incluir 'settlement').
- Actualizar `expenses_rpc_v2.sql` (validación de `p_kind` ya acepta input libre — basta confirmar).
- RLS: sin cambios (settlement usa misma policy que expense).

## Orden de ejecución
Ejecutar módulos en orden numérico. Cada módulo:
1. Hace los cambios.
2. `npm run typecheck` debe pasar limpio.
3. Actualiza CHANGELOG.md con entry `[06.0X]`.
4. Commit puntual con mensaje `feat(balance)[06.0X]: <descripción>`.

Al cerrar fase (99): smoke test E2E, mover items en TASKS.md, actualizar STATE.md → Fase 7, commit `chore(balance)[06.99]: cerrar Fase 6`.
