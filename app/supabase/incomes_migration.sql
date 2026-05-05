-- ============================================================================
-- WallaTeam — Migración: agregar `kind` a la tabla `expenses` (Polish post-Fase 4)
-- Correr en Supabase Dashboard → SQL Editor → New query → Run
-- Idempotente: usa add column if not exists + create index if not exists.
--
-- Motivación (ADR-013): la tabla `expenses` pasa a representar TRANSACCIONES
-- signadas. `kind='expense'` resta del saldo, `kind='income'` suma.
-- Las filas existentes adoptan 'expense' por la default → no requiere backfill.
-- El nombre de la tabla se mantiene para no romper RLS, RPC ni clientes.
-- ============================================================================

alter table expenses
  add column if not exists kind text not null default 'expense'
  check (kind in ('expense','income'));

create index if not exists expenses_kind_idx on expenses(wallet_id, kind);
