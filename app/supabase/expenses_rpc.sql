-- ============================================================================
-- WallaTeam — RPC para crear gasto + split de forma atómica (Fase 3)
-- Correr en Supabase Dashboard → SQL Editor → New query → Run
-- Idempotente: usa create or replace.
-- ============================================================================

create or replace function public.create_expense_with_split(
  p_wallet_id  uuid,
  p_description text,
  p_amount     numeric,
  p_category   text,
  p_paid_by    uuid,
  p_occurred_at timestamptz,
  p_note       text default null
)
returns expenses
language plpgsql
security invoker  -- usa los permisos del usuario llamante (RLS aplica)
as $$
declare
  new_expense expenses;
begin
  insert into expenses (
    wallet_id, description, amount, category,
    paid_by, occurred_at, note, split_mode
  )
  values (
    p_wallet_id, p_description, p_amount, p_category,
    p_paid_by, p_occurred_at, p_note, 'equal'
  )
  returning * into new_expense;

  insert into expense_splits (expense_id, user_id, percentage, amount)
  values (new_expense.id, p_paid_by, 100.00, p_amount);

  return new_expense;
end;
$$;
