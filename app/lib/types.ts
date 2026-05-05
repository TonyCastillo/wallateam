export type WalletType = 'personal' | 'team';

export type WalletIcon =
  | 'wallet' | 'piggy' | 'home' | 'plane'
  | 'briefcase' | 'gift' | 'sparkle' | 'shopping' | 'food';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  icon: WalletIcon;
  color: string;            // hex
  currency_code: string;    // 'PYG' default
  initial_balance: number;
  target_date: string | null;
  budget_alert_pct: number | null;
  is_private: boolean;
  owner_id: string;
  created_at: string;
  archived_at: string | null;
}

export interface NewWalletInput {
  name: string;
  type: WalletType;
  icon: WalletIcon;
  color: string;
  currency_code?: string;
  initial_balance?: number;
  target_date?: string | null;
  budget_alert_pct?: number | null;
  is_private?: boolean;
}

// ---------- Members & Invites (Fase 4) ----------

export type MemberRole = 'admin' | 'member';

export interface WalletMember {
  wallet_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profile?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface WalletInvite {
  id: string;
  wallet_id: string;
  invite_code: string;
  invited_by: string;
  email: string | null;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
}

// ---------- Expenses (Fase 3) ----------

export type SplitMode = 'equal' | 'percent' | 'amount';

/**
 * Tipo de transacción en la tabla `expenses`. Se mantiene el nombre de tabla por
 * legacy / no romper RLS y RPC; semánticamente la tabla es "transactions".
 *   - 'expense' → resta del saldo (gasto)
 *   - 'income'  → suma al saldo (ingreso, ej: sueldo) — solo en wallets personales por ahora
 */
export type ExpenseKind = 'expense' | 'income';

export interface ExpenseSplit {
  expense_id: string;
  user_id: string;
  percentage: number | null;
  amount: number;
}

export interface Expense {
  id: string;
  wallet_id: string;
  description: string;
  amount: number;
  category: string | null;
  kind: ExpenseKind;
  paid_by: string;
  occurred_at: string;
  photo_url: string | null;
  note: string | null;
  split_mode: SplitMode;
  created_at: string;
}

export interface NewExpenseInput {
  wallet_id: string;
  description: string;
  amount: number;
  category: string;
  kind?: ExpenseKind;  // default 'expense' si no viene
  occurred_at?: string;
  note?: string | null;
  paid_by?: string;  // Fase 4: opcional para wallets team — default al user actual
  split_mode: SplitMode;
  splits: { user_id: string; percentage?: number | null; amount: number }[];
}
