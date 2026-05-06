-- 1) Aceptar 'settlement' en el check de kind
alter table expenses
  drop constraint if exists expenses_kind_check;

alter table expenses
  add constraint expenses_kind_check
  check (kind in ('expense','income','settlement'));

-- 2) Índice opcional para filtrar settlements en queries de balance
create index if not exists expenses_settlement_idx
  on expenses(wallet_id, kind)
  where kind = 'settlement';
