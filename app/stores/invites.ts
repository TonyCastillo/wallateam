import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth';
import { WalletInvite } from '@/lib/types';

export interface InvitePreview {
  wallet_id: string;
  wallet_name: string;
  wallet_color: string;
  wallet_icon: string;
  wallet_type: 'personal' | 'team';
  accepted: boolean;
  expired: boolean;
}

interface InvitesState {
  byWallet: Record<string, WalletInvite[]>;
  loading: boolean;
  error: string | null;
  fetchByWallet: (walletId: string) => Promise<void>;
  create: (walletId: string, opts?: { email?: string; expiresInDays?: number }) => Promise<WalletInvite>;
  preview: (code: string) => Promise<InvitePreview | null>;
  accept: (code: string) => Promise<string>; // retorna wallet_id
  revoke: (inviteId: string) => Promise<void>;
}

function generateInviteCode(): string {
  // 8 chars alfanuméricos sin caracteres ambiguos
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export const useInvites = create<InvitesState>((set, get) => ({
  byWallet: {},
  loading: false,
  error: null,

  fetchByWallet: async (walletId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('wallet_invites')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set((state) => ({
        byWallet: { ...state.byWallet, [walletId]: (data ?? []) as WalletInvite[] },
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  create: async (walletId: string, opts = {}) => {
    const userId = useAuth.getState().user?.id;
    if (!userId) throw new Error('No autenticado');

    const expires_at = opts.expiresInDays
      ? new Date(Date.now() + opts.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Reintenta hasta 3 veces si choca con un código existente (extremadamente raro)
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const invite_code = generateInviteCode();
      const { data, error } = await supabase
        .from('wallet_invites')
        .insert({
          wallet_id: walletId,
          invite_code,
          invited_by: userId,
          email: opts.email ?? null,
          expires_at,
        })
        .select()
        .single();

      if (!error) {
        const invite = data as WalletInvite;
        set((state) => ({
          byWallet: {
            ...state.byWallet,
            [walletId]: [invite, ...(state.byWallet[walletId] ?? [])],
          },
        }));
        return invite;
      }

      lastError = error;
      // Si no es colisión de unique, salir del loop
      if (!error.message.toLowerCase().includes('duplicate')) break;
    }
    throw lastError ?? new Error('No se pudo generar invitación');
  },

  preview: async (code: string) => {
    const { data, error } = await supabase.rpc('get_invite_preview', { p_code: code });
    if (error) throw error;
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    const row = Array.isArray(data) ? data[0] : data;
    return row as InvitePreview;
  },

  accept: async (code: string) => {
    const { data, error } = await supabase.rpc('accept_wallet_invite', { p_code: code });
    if (error) throw error;
    return data as string;
  },

  revoke: async (inviteId: string) => {
    const { data, error } = await supabase
      .from('wallet_invites')
      .update({ expires_at: new Date(0).toISOString() })
      .eq('id', inviteId)
      .select()
      .single();
    if (error) throw error;
    const updated = data as WalletInvite;
    set((state) => ({
      byWallet: {
        ...state.byWallet,
        [updated.wallet_id]: (state.byWallet[updated.wallet_id] ?? []).map((i) =>
          i.id === updated.id ? updated : i,
        ),
      },
    }));
  },
}));
