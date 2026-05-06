import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth';
import { Expense, ExpenseKind, ExpenseSplit, NewExpenseInput } from '@/lib/types';

interface ExpensesState {
  /** Cache: gastos por wallet_id (más recientes primero) */
  byWallet: Record<string, Expense[]>;
  /** Cache: splits indexados por expense_id (cargados a demanda por wallet) */
  splitsByExpense: Record<string, ExpenseSplit[]>;
  loading: boolean;
  /** Loading separado para fetchSplitsByWallet (no comparte con loading principal) */
  splitsLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchByWallet: (walletId: string) => Promise<Expense[]>;
  fetchSplitsByWallet: (walletId: string) => Promise<void>;
  create: (input: NewExpenseInput) => Promise<Expense>;
  update: (id: string, patch: Partial<NewExpenseInput>) => Promise<Expense>;
  remove: (id: string) => Promise<void>;

  list: (walletId: string) => Expense[];
  totals: (walletId: string) => { spent: number; income: number; count: number };
}

const VALID_KINDS: Set<ExpenseKind> = new Set(['expense', 'income', 'settlement']);

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
  const kind = (raw.kind && VALID_KINDS.has(raw.kind) ? raw.kind : 'expense') as ExpenseKind;
  return {
    ...raw,
    amount: Number(raw.amount),
    kind,
  };
}

function normalizeSplit(raw: ExpenseSplit): ExpenseSplit {
  return {
    ...raw,
    amount: Number(raw.amount),
    percentage: raw.percentage === null ? null : Number(raw.percentage),
  };
}

export const useExpenses = create<ExpensesState>((set, get) => ({
  byWallet: {},
  splitsByExpense: {},
  loading: false,
  splitsLoading: false,
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

  /**
   * Carga los splits de todos los expenses de una wallet. Indispensable para
   * calcular el balance del grupo en wallets team. Llama a la tabla
   * expense_splits filtrando por los expense_ids ya cacheados (o haciendo un
   * fetch previo de expenses si la cache está vacía).
   */
  fetchSplitsByWallet: async (walletId) => {
    set({ splitsLoading: true });
    try {
      let expenseIds = (get().byWallet[walletId] ?? []).map((e) => e.id);
      if (expenseIds.length === 0) {
        const list = await get().fetchByWallet(walletId);
        expenseIds = list.map((e) => e.id);
      }
      if (expenseIds.length === 0) {
        set({ splitsLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('expense_splits')
        .select('*')
        .in('expense_id', expenseIds);
      if (error) throw error;

      const grouped: Record<string, ExpenseSplit[]> = {};
      (data ?? []).forEach((row) => {
        const sp = normalizeSplit(row as ExpenseSplit);
        grouped[sp.expense_id] ??= [];
        grouped[sp.expense_id].push(sp);
      });

      set((s) => ({
        splitsByExpense: { ...s.splitsByExpense, ...grouped },
        splitsLoading: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error cargando splits';
      set({ error: msg, splitsLoading: false });
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
        p_split_mode: input.split_mode,
        p_splits: input.splits,
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
