import { useEffect, useMemo } from 'react';
import type { Expense, ExpenseSplit } from './types';
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';
import { useAuth } from '@/stores/auth';

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

// ----------------------------------------------------------------------------
// Hook React que conecta el algoritmo con los stores de Zustand
// ----------------------------------------------------------------------------

export interface BalanceResult {
  /** Saldos por miembro, ordenados desc. Incluye miembros sin movimientos (net=0). */
  nets: MemberNet[];
  /** Transferencias mínimas necesarias para que todos queden en 0. */
  transfers: Transfer[];
  /** Saldo del usuario actual. 0 si no está en la wallet o no hay movimientos. */
  myNet: number;
  /** True si todos los miembros están en 0 (no hay deudas pendientes). */
  isSettled: boolean;
  /** True mientras se cargan los splits de la wallet. */
  loading: boolean;
}

const EMPTY_NETS: MemberNet[] = [];
const EMPTY_TRANSFERS: Transfer[] = [];
const EMPTY_EXPENSES: Expense[] = [];
const EMPTY_SPLITS_INDEX: Record<string, ExpenseSplit[]> = {};

/**
 * Hook que devuelve el balance del grupo para una wallet team. Hace fetch
 * automático de splits + miembros si no están cacheados.
 *
 * Para wallets type='personal' devuelve estado vacío (no aplica el concepto).
 *
 * Renderiza con datos parciales mientras carga: si los expenses ya están en
 * cache pero los splits no, devuelve nets=[] hasta que llegan los splits
 * (no hay manera correcta de calcular saldos sin los splits reales).
 */
export function useBalance(walletId: string | undefined): BalanceResult {
  const userId = useAuth((s) => s.user?.id);
  const wallet = useWallets((s) => (walletId ? s.byId(walletId) : undefined));
  const members = useWallets((s) => (walletId ? s.membersByWallet[walletId] : undefined));
  const fetchMembers = useWallets((s) => s.fetchMembers);
  const expenses = useExpenses((s) => (walletId ? s.byWallet[walletId] : undefined)) ?? EMPTY_EXPENSES;
  const splitsByExpense = useExpenses((s) => s.splitsByExpense);
  const fetchSplitsByWallet = useExpenses((s) => s.fetchSplitsByWallet);
  const splitsLoading = useExpenses((s) => s.splitsLoading);

  // Auto-fetch de splits al montar / cambiar wallet
  useEffect(() => {
    if (walletId && wallet?.type === 'team') {
      fetchSplitsByWallet(walletId);
    }
  }, [walletId, wallet?.type, fetchSplitsByWallet]);

  // Auto-fetch de miembros si no están en cache
  useEffect(() => {
    if (walletId && wallet?.type === 'team' && (!members || members.length === 0)) {
      fetchMembers(walletId);
    }
  }, [walletId, wallet?.type, members, fetchMembers]);

  return useMemo<BalanceResult>(() => {
    if (!walletId || wallet?.type !== 'team') {
      return {
        nets: EMPTY_NETS,
        transfers: EMPTY_TRANSFERS,
        myNet: 0,
        isSettled: true,
        loading: false,
      };
    }

    // Filtrar splits relevantes (los del store son globales por expense_id)
    const relevantSplits: Record<string, ExpenseSplit[]> = {};
    for (const exp of expenses) {
      if (splitsByExpense[exp.id]) {
        relevantSplits[exp.id] = splitsByExpense[exp.id];
      }
    }

    const computed = computeNets(expenses, relevantSplits);

    // Augment: miembros sin movimientos aparecen con net=0
    const present = new Set(computed.map((n) => n.user_id));
    const missing: MemberNet[] = (members ?? [])
      .filter((m) => !present.has(m.user_id))
      .map((m) => ({ user_id: m.user_id, net: 0 }));

    const allNets = [...computed, ...missing].sort((a, b) => b.net - a.net);

    return {
      nets: allNets,
      transfers: simplifyDebts(allNets),
      myNet: userId ? allNets.find((n) => n.user_id === userId)?.net ?? 0 : 0,
      isSettled: isFullySettled(allNets),
      loading: splitsLoading,
    };
  }, [walletId, wallet?.type, userId, expenses, splitsByExpense, members, splitsLoading]);
}

// EMPTY_SPLITS_INDEX exportado para usuarios externos del módulo que necesiten
// pasar un map vacío a computeNets sin crear refs nuevas en cada render.
export { EMPTY_SPLITS_INDEX };
