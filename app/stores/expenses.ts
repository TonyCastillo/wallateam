import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth';
import { Expense, NewExpenseInput } from '@/lib/types';

interface ExpensesState {
  /** Cache: gastos por wallet_id (más recientes primero) */
  byWallet: Record<string, Expense[]>;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchByWallet: (walletId: string) => Promise<Expense[]>;
  create: (input: NewExpenseInput) => Promise<Expense>;
  update: (id: string, patch: Partial<NewExpenseInput>) => Promise<Expense>;
  remove: (id: string) => Promise<void>;

  list: (walletId: string) => Expense[];
  totals: (walletId: string) => { spent: number; income: number; count: number };
}

const EMPTY_LIST: Expense[] = [];

let isSubscribed = false;

function setupRealtimeOnce() {
  if (isSubscribed) return;
  isSubscribed = true;
  supabase
    .channel('expenses-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'expenses' },
      () => {
        useExpenses.getState().fetchAll();
      },
    )
    .subscribe();
}

/**
 * Cast safe del numérico que devuelve Postgres (puede venir como string en JSON
 * cuando el driver no convierte). Aplicar a `amount` siempre.
 */
function normalizeExpense(raw: Expense): Expense {
  return {
    ...raw,
    amount: Number(raw.amount),
    kind: raw.kind === 'income' ? 'income' : 'expense',
  };
}

export const useExpenses = create<ExpensesState>((set, get) => ({
  byWallet: {},
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('occurred_at', { ascending: false });
      if (error) throw error;

      const grouped: Record<string, Expense[]> = {};
      (data ?? []).forEach((row) => {
        const e = normalizeExpense(row as Expense);
        grouped[e.wallet_id] ??= [];
        grouped[e.wallet_id].push(e);
      });

      set({ byWallet: grouped, loading: false });
      setupRealtimeOnce();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error cargando gastos';
      set({ error: msg, loading: false });
    }
  },

  fetchByWallet: async (walletId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('wallet_id', walletId)
        .order('occurred_at', { ascending: false });
      if (error) throw error;

      const list = (data ?? []).map((row) => normalizeExpense(row as Expense));
      set((s) => ({
        byWallet: { ...s.byWallet, [walletId]: list },
        loading: false,
      }));
      return list;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error cargando gastos';
      set({ error: msg, loading: false });
      return [];
    }
  },

  create: async (input) => {
    const userId = useAuth.getState().user?.id;
    if (!userId) throw new Error('Usuario no autenticado');
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('create_expense_with_split', {
        p_wallet_id: input.wallet_id,
        p_description: input.description,
        p_amount: input.amount,
        p_category: input.category,
        p_paid_by: input.paid_by ?? userId,
        p_occurred_at: input.occurred_at ?? new Date().toISOString(),
        p_note: input.note ?? null,
        p_kind: input.kind ?? 'expense',
      });
      if (error) throw error;
      const created = normalizeExpense(data as Expense);

      set((s) => ({
        byWallet: {
          ...s.byWallet,
          [input.wallet_id]: [created, ...(s.byWallet[input.wallet_id] ?? [])],
        },
        loading: false,
      }));
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo crear';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  update: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      const updated = normalizeExpense(data as Expense);

      // Si cambió amount, sincronizar el split (en Fase 3 hay 1 solo split = paid_by con 100%)
      if (patch.amount !== undefined) {
        await supabase
          .from('expense_splits')
          .update({ amount: patch.amount, percentage: 100 })
          .eq('expense_id', id);
      }

      set((s) => {
        const list = s.byWallet[updated.wallet_id] ?? [];
        return {
          byWallet: {
            ...s.byWallet,
            [updated.wallet_id]: list.map((e) => (e.id === id ? updated : e)),
          },
          loading: false,
        };
      });
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo actualizar';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      set((s) => {
        const next: Record<string, Expense[]> = {};
        Object.entries(s.byWallet).forEach(([k, list]) => {
          next[k] = list.filter((e) => e.id !== id);
        });
        return { byWallet: next, loading: false };
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  list: (walletId) => get().byWallet[walletId] ?? EMPTY_LIST,

  totals: (walletId) => {
    const list = get().byWallet[walletId] ?? EMPTY_LIST;
    let spent = 0;
    let income = 0;
    for (const e of list) {
      const amt = Number(e.amount);
      if (e.kind === 'income') income += amt;
      else spent += amt;
    }
    return { spent, income, count: list.length };
  },
}));
