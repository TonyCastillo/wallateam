-- ============================================================================
-- WallaTeam — RPC para crear gasto + split multi-usuario atómico (Fase 5)
-- Correr en Supabase Dashboard → SQL Editor → New query → Run
-- Idempotente: usa create or replace.
-- Reemplaza la versión de Fase 3 para soportar array de splits (JSONB).
-- ============================================================================

create or replace function public.create_expense_with_split(
  p_wallet_id   uuid,
  p_description text,
  p_amount      numeric,
  p_category    text,
  p_paid_by     uuid,
  p_occurred_at timestamptz,
  p_note        text default null,
  p_kind        text default 'expense',
  p_split_mode  text default 'equal',
  p_splits      jsonb default null
)
returns expenses
language plpgsql
security invoker  -- usa los permisos del usuario llamante (RLS aplica)
as $$
declare
  new_expense expenses;
  split_item jsonb;
begin
  if p_kind not in ('expense','income','settlement') then
    raise exception 'kind inválido: %, debe ser expense, income o settlement', p_kind;
  end if;

  if p_split_mode not in ('equal','percent','amount') then
    raise exception 'split_mode inválido: %', p_split_mode;
  end if;

  -- 1. Crear el expense
  insert into expenses (
    wallet_id, description, amount, category,
    paid_by, occurred_at, note, split_mode, kind
  )
  values (
    p_wallet_id, p_description, p_amount, p_category,
    p_paid_by, p_occurred_at, p_note, p_split_mode, p_kind
  )
  returning * into new_expense;

  -- 2. Insertar los splits
  if p_splits is null then
    -- Fallback legacy: si no envían splits, asume 100% al pagador
    insert into expense_splits (expense_id, user_id, percentage, amount)
    values (new_expense.id, p_paid_by, 100.00, p_amount);
  else
    -- Parsear e insertar el array de splits proporcionado por el cliente
    for split_item in select * from jsonb_array_elements(p_splits)
    loop
      insert into expense_splits (expense_id, user_id, percentage, amount)
      values (
        new_expense.id,
        (split_item->>'user_id')::uuid,
        (split_item->>'percentage')::numeric,
        (split_item->>'amount')::numeric
      );
    end loop;
  end if;

  return new_expense;
end;
$$;
