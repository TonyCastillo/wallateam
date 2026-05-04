-- ============================================================================
-- WallaTeam — RPCs + policies para wallet_invites (Fase 4)
-- Correr en Supabase Dashboard → SQL Editor → New query → Run
-- Idempotente: usa create or replace + drop policy if exists.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Policy adicional: permitir UPDATE del invite (para marcar accepted_at).
-- El RPC accept_wallet_invite usa security definer, pero por consistencia
-- y por si querés revocar como invitador, mantenemos esta policy.
-- ----------------------------------------------------------------------------
drop policy if exists "inv_update" on wallet_invites;
create policy "inv_update" on wallet_invites
  for update using (
    invited_by = auth.uid()
    or email = (select email from profiles where id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- get_invite_preview: lookup público por invite_code para mostrar la card
-- antes de aceptar. Devuelve datos básicos de la wallet + estado del invite.
-- security definer porque RLS de wallet_invites no permite SELECT por código
-- a usuarios que no son ni invitador ni destinatario por email.
-- ----------------------------------------------------------------------------
create or replace function public.get_invite_preview(p_code text)
returns table (
  wallet_id uuid,
  wallet_name text,
  wallet_color text,
  wallet_icon text,
  wallet_type text,
  accepted boolean,
  expired boolean
)
language sql
security definer
set search_path = public
as $$
  select
    w.id,
    w.name,
    w.color,
    w.icon,
    w.type,
    (i.accepted_at is not null) as accepted,
    (i.expires_at is not null and i.expires_at < now()) as expired
  from wallet_invites i
  join wallets w on w.id = i.wallet_id
  where i.invite_code = p_code
  limit 1;
$$;

-- ----------------------------------------------------------------------------
-- accept_wallet_invite: acepta un invite por código. Inserta wallet_member
-- (idempotente) y marca accepted_at. Devuelve el wallet_id.
-- security definer porque el usuario que acepta no es el owner del wallet
-- y por lo tanto no pasaría el check RLS de wallet_members_insert.
-- ----------------------------------------------------------------------------
create or replace function public.accept_wallet_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite wallet_invites%rowtype;
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'No autenticado';
  end if;

  select * into v_invite from wallet_invites where invite_code = p_code;
  if not found then
    raise exception 'Invitación no encontrada';
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at < now() then
    raise exception 'Invitación vencida';
  end if;

  -- Insert idempotente: si ya es miembro, ignora
  insert into wallet_members (wallet_id, user_id, role)
  values (v_invite.wallet_id, v_user, 'member')
  on conflict (wallet_id, user_id) do nothing;

  -- Marcar como aceptado (solo la primera vez)
  if v_invite.accepted_at is null then
    update wallet_invites
       set accepted_at = now()
     where id = v_invite.id;
  end if;

  return v_invite.wallet_id;
end;
$$;
