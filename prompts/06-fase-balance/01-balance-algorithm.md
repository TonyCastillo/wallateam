# 06.01 — Algoritmo de balance y simplificación de deudas

## Objetivo
Crear `app/lib/balance.ts` con dos funciones puras, sin acoplamiento a stores ni a React, fácilmente testeables.

## Tareas

### 1. Tipos
```ts
export interface MemberNet {
  user_id: string;
  /** Saldo neto. > 0 = le deben (acreedor). < 0 = debe (deudor). */
  net: number;
}

export interface Transfer {
  from: string;   // user_id deudor
  to: string;     // user_id acreedor
  amount: number; // siempre positivo
}
```

### 2. `computeNets(expenses, splits)`
Función pura que recibe la lista de expenses (con su kind) + la lista de splits cruzada por expense_id, y devuelve `MemberNet[]` con el saldo neto de cada miembro que aparece en cualquier rol (paid_by o split user_id).

- Considera expenses con `kind === 'expense'` y `kind === 'settlement'` (ambos suman al `paid_by` y restan al `split.user_id`).
- **Ignora** expenses con `kind === 'income'` (no aplican a team — son del modelo cuenta bancaria personal).
- Redondear a entero (es-PY no usa decimales en guaraníes).

### 3. `simplifyDebts(nets)`
Función pura que recibe `MemberNet[]` y devuelve `Transfer[]` minimizando la cantidad de transferencias.

Algoritmo greedy:
1. Separar acreedores (`net > 0`) y deudores (`net < 0`).
2. Ordenar acreedores desc por net, deudores asc por net (más negativo primero).
3. Mientras ambas listas no estén vacías:
   - Tomar el primer acreedor `a` y primer deudor `d`.
   - `monto = Math.min(a.net, -d.net)`.
   - Push `{from: d.user_id, to: a.user_id, amount: monto}`.
   - Restar monto a ambos (`a.net -= monto`, `d.net += monto`).
   - Sacar de la lista los que quedaron en 0.
4. Retornar la lista de transferencias.

### 4. Helpers de UI
```ts
/** "te deben" si net > 0, "debés" si net < 0, "saldado" si === 0 */
export function balanceStatus(net: number): 'credit' | 'debit' | 'settled';

/** True si todos los miembros están en 0 (todo saldado) */
export function isFullySettled(nets: MemberNet[]): boolean;
```

## Validación
- `npm run typecheck` limpio.
- Mental walk con un ejemplo:
  - 3 miembros A/B/C, gasto de ₲ 90.000 pagado por A, split equal.
  - `computeNets`: A=+60.000 (pagó 90, consumió 30), B=-30.000, C=-30.000.
  - `simplifyDebts`: 2 transferencias `[{B→A: 30.000}, {C→A: 30.000}]`.
  - `isFullySettled`: false antes, true después de aplicar las settlements.

## Bitácora
Entry `[06.01]` en CHANGELOG. Commit `feat(balance)[06.01]: algoritmo computeNets + simplifyDebts`.
