import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';

export interface WalletMetrics {
  /** initial_balance fijo de la wallet */
  presupuesto: number;
  /** suma de transacciones kind='expense' */
  gastado: number;
  /** suma de transacciones kind='income' */
  ingresos: number;
  /** presupuesto − gastado (modelo team / presupuestario) */
  restante: number;
  /** presupuesto + ingresos − gastado (modelo personal / cuenta bancaria) */
  saldoActual: number;
  /** 0..1 (puede superar 1 si se gastó más del presupuesto) */
  usedPct: number;
  count: number;
  overBudget: boolean;
}

export function useWalletMetrics(walletId: string | undefined): WalletMetrics {
  const wallet = useWallets((s) => (walletId ? s.byId(walletId) : undefined));
  const expensesList = useExpenses((s) => (walletId ? s.list(walletId) : []));

  const presupuesto = Number(wallet?.initial_balance ?? 0);
  const gastado = expensesList
    .filter((e) => e.kind !== 'income')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const ingresos = expensesList
    .filter((e) => e.kind === 'income')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const restante = presupuesto - gastado;
  const saldoActual = presupuesto + ingresos - gastado;
  const usedPct = presupuesto > 0 ? gastado / presupuesto : 0;
  const count = expensesList.length;

  return {
    presupuesto,
    gastado,
    ingresos,
    restante,
    saldoActual,
    usedPct,
    count,
    overBudget: usedPct >= 1,
  };
}

/**
 * Balance actual de una wallet = initial_balance + ingresos − gastos.
 * Para wallets sin transacciones devuelve initial_balance.
 */
export function useWalletBalance(walletId: string): number {
  const wallet = useWallets((s) => s.byId(walletId));
  const expensesList = useExpenses((s) => s.list(walletId));

  const initial = Number(wallet?.initial_balance ?? 0);
  let delta = 0;
  for (const e of expensesList) {
    const amt = Number(e.amount);
    delta += e.kind === 'income' ? amt : -amt;
  }
  return initial + delta;
}
