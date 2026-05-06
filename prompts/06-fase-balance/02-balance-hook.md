# 06.02 — Hook useBalance

## Objetivo
Conectar el algoritmo puro de 06.01 con los stores de Zustand vía un hook que el UI consume.

## Tareas

### 1. `useBalance(walletId)` en `app/lib/balance.ts`
- Subscribe a `useWallets`, `useExpenses` y `useAuth` con selectores fine-grained (evitar re-renders en cambios irrelevantes).
- Para cargar los splits: el store de expenses hoy NO carga `expense_splits` separados (los recibe vía RPC al crear). Hay que decidir:
  - **Opción A (simple):** asumir split_mode='equal' y derivar splits desde `expenses` + `wallet_members`. Funciona para Fase 5 'equal' pero rompe con 'percent' y 'amount' (que sí persisten splits reales en DB).
  - **Opción B (correcto):** agregar `fetchSplits(walletId)` al store de expenses que hace `select * from expense_splits where expense_id in (...)` y guarda en `splitsByExpense: Record<string, ExpenseSplit[]>`. Llamarlo cuando se entra a la tab Resumen.

  → Usar **Opción B**. Es lo correcto y la lectura adicional de `expense_splits` es barata (índice por `expense_id` ya existe).

### 2. Retorno del hook
```ts
interface BalanceResult {
  nets: MemberNet[];          // ordenado desc por net (acreedores primero)
  transfers: Transfer[];      // resultado de simplifyDebts
  myNet: number;              // shortcut: nets.find(n => n.user_id === currentUserId)?.net ?? 0
  isSettled: boolean;
  loading: boolean;
}

export function useBalance(walletId: string | undefined): BalanceResult;
```

### 3. Integración con `wallet_members`
El hook tiene que conocer todos los miembros del wallet (no solo los que aparecen en expenses) para mostrarlos aunque tengan net=0. Reusar `useWallets((s) => s.membersByWallet[walletId])` y hacer fallback a `fetchMembers` si está vacío.

## Validación
- `npm run typecheck` limpio.
- Hook funciona aunque la wallet no tenga gastos todavía (devuelve `nets=[], transfers=[], isSettled=true, loading=false`).

## Bitácora
Entry `[06.02]` en CHANGELOG. Commit `feat(balance)[06.02]: useBalance hook + fetchSplits en store`.
