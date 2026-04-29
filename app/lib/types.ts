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
