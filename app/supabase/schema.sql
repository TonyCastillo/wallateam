-- ============================================================================
-- WallaTeam — Schema (Fase 1)
-- Correr este archivo en Supabase Dashboard → SQL Editor → New query → Run
-- Idempotente: usa "create table if not exists" donde aplica.
-- ============================================================================

-- Habilitar pgcrypto para gen_random_uuid()
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- profiles (extiende auth.users)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- currencies (catálogo)
-- ----------------------------------------------------------------------------
create table if not exists currencies (
  code text primary key,
  symbol text not null,
  name text not null,
  decimals smallint not null default 0
);

-- ----------------------------------------------------------------------------
-- wallets
-- ----------------------------------------------------------------------------
create table if not exists wallets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('personal','team')),
  icon text not null default 'wallet',
  color text not null default '#16A085',
  currency_code text not null default 'PYG' references currencies(code),
  initial_balance numeric(18,2) not null default 0,
  target_date date,
  budget_alert_pct smallint default 80,
  is_private boolean default false,
  owner_id uuid not null references profiles(id),
  created_at timestamptz default now(),
  archived_at timestamptz
);

-- ----------------------------------------------------------------------------
-- wallet_members (solo type='team')
-- ----------------------------------------------------------------------------
create table if not exists wallet_members (
  wallet_id uuid references wallets(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('admin','member')),
  joined_at timestamptz default now(),
  primary key (wallet_id, user_id)
);

-- ----------------------------------------------------------------------------
-- expenses
-- ----------------------------------------------------------------------------
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references wallets(id) on delete cascade,
  description text not null,
  amount numeric(18,2) not null,
  category text,
  paid_by uuid not null references profiles(id),
  occurred_at timestamptz not null default now(),
  photo_url text,
  note text,
  split_mode text not null default 'equal' check (split_mode in ('equal','percent','amount')),
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- expense_splits
-- ----------------------------------------------------------------------------
create table if not exists expense_splits (
  expense_id uuid references expenses(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  percentage numeric(5,2),
  amount numeric(18,2) not null,
  primary key (expense_id, user_id)
);

-- ----------------------------------------------------------------------------
-- wallet_invites
-- ----------------------------------------------------------------------------
create table if not exists wallet_invites (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references wallets(id) on delete cascade,
  email text,
  invite_code text unique,
  invited_by uuid references profiles(id),
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- Seed: catálogo de monedas
-- ----------------------------------------------------------------------------
insert into currencies (code, symbol, name, decimals) values
  ('PYG', '₲', 'Guaraní paraguayo', 0),
  ('USD', '$', 'Dólar estadounidense', 2),
  ('ARS', '$', 'Peso argentino', 2),
  ('EUR', '€', 'Euro', 2)
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- Trigger: crear profile automáticamente al hacer signup
-- Toma full_name de raw_user_meta_data, fallback al prefijo del email
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
