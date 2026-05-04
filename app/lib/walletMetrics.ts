import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';

export interface WalletMetrics {
  presupuesto: number;
  gastado: number;
  restante: number;
  /** 0..1 (puede superar 1 si se gastó más del presupuesto) */
  usedPct: number;
  count: number;
  overBudget: boolean;
}

export function useWalletMetrics(walletId: string | undefined): WalletMetrics {
  const wallet = useWallets((s) => (walletId ? s.byId(walletId) : undefined));
  const expensesList = useExpenses((s) => (walletId ? s.list(walletId) : []));

  const presupuesto = Number(wallet?.initial_balance ?? 0);
  const gastado = expensesList.reduce((acc, e) => acc + Number(e.amount), 0);
  const restante = presupuesto - gastado;
  const usedPct = presupuesto > 0 ? gastado / presupuesto : 0;
  const count = expensesList.length;

  return { presupuesto, gastado, restante, usedPct, count, overBudget: usedPct >= 1 };
}
