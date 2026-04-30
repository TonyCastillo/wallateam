import type { CategoryId } from './categories';

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

// ---------- Expenses (Fase 3) ----------

export type SplitMode = 'equal' | 'percent' | 'amount';

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
  category: CategoryId | null;
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
  category: CategoryId;
  occurred_at?: string;
  note?: string | null;
  // En Fase 3: paid_by se infiere del user actual; split_mode='equal' fijo
}
