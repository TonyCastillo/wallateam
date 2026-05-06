# 06.05 — Empty states y edge cases

## Objetivo
Cubrir los casos en los que el balance no tiene contenido relevante para evitar pantallas raras.

## Casos a cubrir

### 1. Wallet team con 1 solo miembro
Aún no aceptaron invitaciones. Mostrar empty state con copy:
> "Invitá al menos un miembro para empezar a registrar gastos compartidos."
> [Botón: Invitar (abre InviteSheet)]

### 2. Wallet team con miembros pero sin gastos
Hay miembros pero ningún gasto registrado todavía. Copy:
> "Todavía no hay gastos en este grupo."
> "Cargá el primer gasto y vas a ver acá quién debe a quién."

### 3. Wallet team con gastos pero todos saldaron
`isFullySettled === true` después de saldar todo. Copy:
> "¡Todo saldado!"
> "Nadie debe nada al resto del grupo."
> Ícono de check verde grande arriba.

### 4. Wallet personal
Tab Resumen mantiene el placeholder actual ("Próximamente — Fase 8"). Sin cambios de copy.

### 5. Loading inicial de splits
Mientras `useBalance.loading === true`: mostrar 2-3 skeletons de `BalanceLine` con animación pulsante.

### 6. Error de carga
Si falla `fetchSplits` (network, RLS, lo que sea): mostrar inline error con botón "Reintentar".

## Implementación
Todos los empty states viven dentro del bloque `tab === 'resumen' && wallet.type === 'team'` en `app/app/(app)/wallet/[id].tsx`. Componente helper opcional `EmptyBalance` en `app/components/EmptyBalance.tsx` con `variant: 'no-members' | 'no-expenses' | 'all-settled'`.

## Validación
Probar cada caso manualmente:
- Crear wallet team nueva (sin invitar a nadie aún).
- Aceptar invitación pero sin cargar gastos.
- Cargar gastos y verificar saldos.
- Saldar todo y verificar empty "Todo saldado".

## Bitácora
Entry `[06.05]` en CHANGELOG. Commit `feat(balance)[06.05]: empty states y edge cases`.
