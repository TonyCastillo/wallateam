import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth';
import { Wallet, NewWalletInput } from '@/lib/types';

interface WalletsState {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<Wallet | null>;
  create: (input: NewWalletInput) => Promise<Wallet>;
  archive: (id: string) => Promise<void>;
  byId: (id: string) => Wallet | undefined;
}

let isSubscribed = false;

export const useWallets = create<WalletsState>((set, get) => ({
  wallets: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ wallets: data as Wallet[], loading: false });

      // Realtime subscription setup
      if (!isSubscribed) {
        isSubscribed = true;
        supabase
          .channel('wallets-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
            get().fetchAll();
          })
          .subscribe();
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      set({ loading: false });
      return data as Wallet | null;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  create: async (input: NewWalletInput) => {
    set({ loading: true, error: null });
    try {
      const owner_id = useAuth.getState().user?.id;
      if (!owner_id) throw new Error('Usuario no autenticado');

      const newWallet = {
        ...input,
        owner_id,
        currency_code: input.currency_code ?? 'PYG',
        initial_balance: input.initial_balance ?? 0,
        is_private: input.is_private ?? false,
      };

      const { data, error } = await supabase
        .from('wallets')
        .insert(newWallet)
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        wallets: [data as Wallet, ...state.wallets],
        loading: false
      }));

      return data as Wallet;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  archive: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const archived_at = new Date().toISOString();
      const { error } = await supabase
        .from('wallets')
        .update({ archived_at })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        wallets: state.wallets.filter((w) => w.id !== id),
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  byId: (id: string) => {
    return get().wallets.find((w) => w.id === id);
  },
}));

export function useTotalBalance(): { personal: number; team: number; total: number } {
  const wallets = useWallets((s) => s.wallets);
  const userId = useAuth((s) => s.user?.id);

  let personal = 0;
  let team = 0;

  wallets.forEach((w) => {
    if (w.type === 'personal' && w.owner_id === userId) {
      personal += w.initial_balance;
    } else if (w.type === 'team') {
      team += w.initial_balance;
    }
  });

  return { personal, team, total: personal + team };
}
