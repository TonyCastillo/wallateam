import type { Expense, ExpenseSplit } from './types';

/**
 * Saldo neto de un miembro dentro de una wallet team.
 * - net > 0: le deben plata (acreedor).
 * - net < 0: debe plata (deudor).
 * - net === 0: saldado.
 */
export interface MemberNet {
  user_id: string;
  net: number;
}

/**
 * Transferencia mínima sugerida para reducir el grafo de deudas.
 * Siempre `amount > 0`.
 */
export interface Transfer {
  from: string; // deudor
  to: string;   // acreedor
  amount: number;
}

/**
 * Tipos de expense que cuentan para el balance del grupo.
 * 'income' se ignora porque solo aplica al modelo cuenta bancaria de wallets personales.
 */
const BALANCE_KINDS = new Set(['expense', 'settlement']);

/**
 * Calcula el saldo neto de cada usuario que aparece en cualquier rol
 * (paid_by o split.user_id) dentro de los expenses provistos.
 *
 * Función pura: misma entrada → misma salida. No accede a stores ni a la red.
 *
 * Reglas:
 * - kind 'expense' y 'settlement' contribuyen igual (paid_by suma; split.user_id resta).
 * - kind 'income' se ignora (no aplica a wallets team).
 * - Los amounts se redondean a entero (PYG no usa decimales).
 *
 * @param expenses lista completa de expenses del wallet
 * @param splitsByExpense map expense_id → splits[]
 */
export function computeNets(
  expenses: Expense[],
  splitsByExpense: Record<string, ExpenseSplit[]>,
): MemberNet[] {
  const netByUser = new Map<string, number>();

  const bump = (uid: string, delta: number) => {
    netByUser.set(uid, (netByUser.get(uid) ?? 0) + delta);
  };

  for (const exp of expenses) {
    if (!BALANCE_KINDS.has(exp.kind)) continue;

    const amount = Math.round(Number(exp.amount));
    if (amount <= 0) continue;

    bump(exp.paid_by, amount);

    const splits = splitsByExpense[exp.id] ?? [];
    for (const sp of splits) {
      bump(sp.user_id, -Math.round(Number(sp.amount)));
    }
  }

  return Array.from(netByUser.entries())
    .map(([user_id, net]) => ({ user_id, net }))
    .sort((a, b) => b.net - a.net);
}

/**
 * Greedy debt simplification. Para grupos chicos (<10 miembros) produce el
 * mínimo de transferencias en casi todos los casos prácticos. El óptimo
 * exacto es NP-hard (subset sum) y no se justifica para este uso.
 *
 * Algoritmo:
 *   1. Separar en acreedores (net > 0) y deudores (net < 0).
 *   2. Mientras ambos no estén vacíos: tomar mayor acreedor + mayor deudor,
 *      transferir el min(|deudor|, acreedor), restar a ambos, sacar los que
 *      quedaron en cero.
 *
 * Función pura. No muta el input.
 */
export function simplifyDebts(nets: MemberNet[]): Transfer[] {
  // Tolerancia de 1 G para flotantes residuales — PYG es entero pero los splits
  // por porcentaje pueden tirar 33.33 → 33333.33 que redondea a 33333 y deja
  // residuos de 1 G que no son una deuda real.
  const EPS = 1;

  const creditors = nets.filter((n) => n.net > EPS).map((n) => ({ ...n }));
  const debtors = nets.filter((n) => n.net < -EPS).map((n) => ({ ...n, net: -n.net }));

  creditors.sort((a, b) => b.net - a.net);
  debtors.sort((a, b) => b.net - a.net);

  const transfers: Transfer[] = [];

  let i = 0;
  let j = 0;
  while (i < creditors.length && j < debtors.length) {
    const cred = creditors[i];
    const deb = debtors[j];
    const amount = Math.min(cred.net, deb.net);

    if (amount > EPS) {
      transfers.push({ from: deb.user_id, to: cred.user_id, amount: Math.round(amount) });
    }

    cred.net -= amount;
    deb.net -= amount;

    if (cred.net <= EPS) i++;
    if (deb.net <= EPS) j++;
  }

  return transfers;
}

/**
 * Estado human-readable de un saldo neto. Útil para sublabels.
 */
export type BalanceStatus = 'credit' | 'debit' | 'settled';

export function balanceStatus(net: number, tolerance = 1): BalanceStatus {
  if (net > tolerance) return 'credit';
  if (net < -tolerance) return 'debit';
  return 'settled';
}

/**
 * True si todos los miembros están en cero (todo saldado, no quedan deudas).
 */
export function isFullySettled(nets: MemberNet[], tolerance = 1): boolean {
  return nets.every((n) => Math.abs(n.net) <= tolerance);
}
