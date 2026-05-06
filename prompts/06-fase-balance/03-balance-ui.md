# 06.03 — UI tab Resumen con Balance del grupo

## Objetivo
Reemplazar el placeholder "Próximamente — Fase 8" de la tab "Resumen" por el contenido real de balance, solo en wallets `type='team'`. Wallets personales mantienen el mensaje vacío (o un placeholder propio).

## Tareas

### 1. Componente `BalanceLine` en `app/components/BalanceLine.tsx`
Replicar el JSX del mock (`design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx` función `BalanceLine`). Estructura:
- Avatar 28px (color primary si net > 0, secondary si < 0).
- Nombre 13px medium textPrimary (flex 1).
- Monto 13px bold (accent verde si > 0, danger rojo si < 0) usando `fmtGsSigned`.
- Sublabel 10px textSecondary: "te deben" / "debés" / "saldado".

### 2. Componente `TransferLine` en `app/components/TransferLine.tsx`
Para cada `Transfer { from, to, amount }`:
- Avatar `from` 24px → flecha → Avatar `to` 24px.
- Texto: `${nombreFrom} debe ${fmtGs(amount)} a ${nombreTo}`.
- Si `from === currentUserId` o `to === currentUserId`: highlight con border accent + botón "Marcar como saldado" a la derecha.

### 3. Tab Resumen — `app/app/(app)/wallet/[id].tsx`
Cuando `tab === 'resumen'`:
- **Si `wallet.type === 'personal'`:** mostrar el placeholder existente ("Próximamente — Fase 8").
- **Si `wallet.type === 'team'`:**
  - Header: "TU SALDO" + monto signed grande del usuario actual.
  - Sección "Balance del grupo": label uppercase + lista de `BalanceLine` por cada miembro (incluido el current user con label "Vos" en vez del nombre).
  - Sección "Transferencias necesarias": label uppercase + lista de `TransferLine` con la salida de `simplifyDebts`. Si `isSettled === true`: empty state ("¡Todo saldado! Nadie debe nada.").
  - Botón "Marcar como saldado" prominente solo aparece dentro de cada `TransferLine` que involucra al current user (módulo 06.04 lo hace funcional).

### 4. Loading state
Mientras `loading === true` (primera carga de splits), mostrar 2-3 skeletons de BalanceLine.

## Validación
- Wallet team con 3 miembros y 2-3 gastos → ver saldos correctos y 1-2 transferencias minimizadas.
- Wallet personal → tab Resumen sigue mostrando "Próximamente".
- `npm run typecheck` limpio.

## Bitácora
Entry `[06.03]` en CHANGELOG. Commit `feat(balance)[06.03]: tab Resumen con balance del grupo + transferencias`.
