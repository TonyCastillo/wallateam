-- ============================================================================
-- WallaTeam — RLS Policies (Fase 1)
-- Correr DESPUÉS de schema.sql en Supabase Dashboard → SQL Editor → Run
-- Idempotente: drop policy if exists antes de cada create policy.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper: ¿es el user member del wallet (incluye al owner)?
-- security definer para que la policy pueda evaluarse sin loops RLS
-- ----------------------------------------------------------------------------
create or replace function public.is_wallet_member(_wallet uuid, _user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from wallet_members where wallet_id = _wallet and user_id = _user
  ) or exists (
    select 1 from wallets where id = _wallet and owner_id = _user
  );
$$;

-- ----------------------------------------------------------------------------
-- Habilitar RLS en todas las tablas
-- ----------------------------------------------------------------------------
alter table profiles         enable row level security;
alter table currencies       enable row level security;
alter table wallets          enable row level security;
alter table wallet_members   enable row level security;
alter table expenses         enable row level security;
alter table expense_splits   enable row level security;
alter table wallet_invites   enable row level security;

-- ----------------------------------------------------------------------------
-- profiles: cada user ve y edita su propio profile
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- currencies: lectura pública (catálogo)
-- ----------------------------------------------------------------------------
drop policy if exists "currencies_read_all" on currencies;
create policy "currencies_read_all" on currencies
  for select using (true);

-- ----------------------------------------------------------------------------
-- wallets: owner o member ve; solo owner edita/borra
-- ----------------------------------------------------------------------------
drop policy if exists "wallets_select_member" on wallets;
create policy "wallets_select_member" on wallets
  for select using (owner_id = auth.uid() or public.is_wallet_member(id, auth.uid()));

drop policy if exists "wallets_insert_own" on wallets;
create policy "wallets_insert_own" on wallets
  for insert with check (owner_id = auth.uid());

drop policy if exists "wallets_update_owner" on wallets;
create policy "wallets_update_owner" on wallets
  for update using (owner_id = auth.uid());

drop policy if exists "wallets_delete_owner" on wallets;
create policy "wallets_delete_owner" on wallets
  for delete using (owner_id = auth.uid());

-- ----------------------------------------------------------------------------
-- wallet_members: visible si sos miembro del wallet; solo owner añade/borra
-- ----------------------------------------------------------------------------
drop policy if exists "wm_select" on wallet_members;
create policy "wm_select" on wallet_members
  for select using (public.is_wallet_member(wallet_id, auth.uid()));

drop policy if exists "wm_insert_admin" on wallet_members;
create policy "wm_insert_admin" on wallet_members
  for insert with check (
    exists (select 1 from wallets w where w.id = wallet_id and w.owner_id = auth.uid())
  );

drop policy if exists "wm_delete_admin" on wallet_members;
create policy "wm_delete_admin" on wallet_members
  for delete using (
    exists (select 1 from wallets w where w.id = wallet_id and w.owner_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- expenses: visibles para miembros del wallet; insert solo si paid_by = user
-- ----------------------------------------------------------------------------
drop policy if exists "exp_select" on expenses;
create policy "exp_select" on expenses
  for select using (public.is_wallet_member(wallet_id, auth.uid()));

-- exp_insert: el invocador debe ser miembro del wallet.
-- paid_by debe ser un miembro del wallet también (no necesariamente el invocador,
-- así otros miembros pueden registrar un gasto pagado por otro miembro del equipo).
drop policy if exists "exp_insert" on expenses;
create policy "exp_insert" on expenses
  for insert with check (
    public.is_wallet_member(wallet_id, auth.uid())
    and public.is_wallet_member(wallet_id, paid_by)
  );

drop policy if exists "exp_update" on expenses;
create policy "exp_update" on expenses
  for update using (public.is_wallet_member(wallet_id, auth.uid()));

drop policy if exists "exp_delete" on expenses;
create policy "exp_delete" on expenses
  for delete using (public.is_wallet_member(wallet_id, auth.uid()));

-- ----------------------------------------------------------------------------
-- expense_splits: visibles si sos miembro del wallet del expense
-- ----------------------------------------------------------------------------
drop policy if exists "es_select" on expense_splits;
create policy "es_select" on expense_splits
  for select using (
    exists (
      select 1 from expenses e
      where e.id = expense_id and public.is_wallet_member(e.wallet_id, auth.uid())
    )
  );

drop policy if exists "es_modify" on expense_splits;
create policy "es_modify" on expense_splits
  for all using (
    exists (
      select 1 from expenses e
      where e.id = expense_id and public.is_wallet_member(e.wallet_id, auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- wallet_invites: invitador ve sus invites; destinatario ve por email match
-- ----------------------------------------------------------------------------
drop policy if exists "inv_select" on wallet_invites;
create policy "inv_select" on wallet_invites
  for select using (
    invited_by = auth.uid()
    or email = (select email from profiles where id = auth.uid())
  );

drop policy if exists "inv_insert" on wallet_invites;
create policy "inv_insert" on wallet_invites
  for insert with check (invited_by = auth.uid());
