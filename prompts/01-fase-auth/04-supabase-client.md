# 04 — Supabase: project, schema, RLS, cliente RN

## Objetivo
Crear el project Supabase, correr el schema completo, aplicar RLS policies, y conectar el cliente desde la app con persistencia de sesión vía AsyncStorage.

## Pre-requisitos
- Módulo 01 completado (`@supabase/supabase-js`, `AsyncStorage`, `react-native-url-polyfill` instalados)
- Cuenta en supabase.com lista

## Contexto necesario
- `prompts/00-MASTER.md` sección 7 (modelo de datos)
- `design_handoff_wallateam_mvp/README.md` líneas 169-247 (SQL completo)

## Tareas

### 1. Crear project Supabase

1. Ir a https://supabase.com/dashboard
2. New project — nombre `wallateam-mvp`, region más cercana (sa-east-1 si está disponible)
3. Guardar la **Database password** en password manager
4. Copiar **Project URL** y **anon public key** (Settings → API)

### 2. Crear `app/.env` (local, no commiteado)

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Crear `app/supabase/schema.sql`

Copiar literal del README líneas 169-247 + agregar al final:

```sql
-- Seed currencies
insert into currencies (code, symbol, name, decimals) values
  ('PYG', '₲', 'Guaraní paraguayo', 0),
  ('USD', '$', 'Dólar estadounidense', 2),
  ('ARS', '$', 'Peso argentino', 2),
  ('EUR', '€', 'Euro', 2)
on conflict (code) do nothing;

-- Auto-create profile on signup
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
```

### 4. Crear `app/supabase/policies.sql`

```sql
-- Helpers
create or replace function public.is_wallet_member(_wallet uuid, _user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from wallet_members where wallet_id = _wallet and user_id = _user
  ) or exists (
    select 1 from wallets where id = _wallet and owner_id = _user
  );
$$;

-- Habilitar RLS
alter table profiles         enable row level security;
alter table currencies       enable row level security;
alter table wallets          enable row level security;
alter table wallet_members   enable row level security;
alter table expenses         enable row level security;
alter table expense_splits   enable row level security;
alter table wallet_invites   enable row level security;

-- profiles: cada user ve y edita su propio profile
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles for update
  using (auth.uid() = id);

-- currencies: lectura pública (catálogo)
drop policy if exists "currencies_read_all" on currencies;
create policy "currencies_read_all" on currencies for select
  using (true);

-- wallets: owner o member ve; solo owner edita
drop policy if exists "wallets_select_member" on wallets;
create policy "wallets_select_member" on wallets for select
  using (owner_id = auth.uid() or public.is_wallet_member(id, auth.uid()));

drop policy if exists "wallets_insert_own" on wallets;
create policy "wallets_insert_own" on wallets for insert
  with check (owner_id = auth.uid());

drop policy if exists "wallets_update_owner" on wallets;
create policy "wallets_update_owner" on wallets for update
  using (owner_id = auth.uid());

drop policy if exists "wallets_delete_owner" on wallets;
create policy "wallets_delete_owner" on wallets for delete
  using (owner_id = auth.uid());

-- wallet_members: visible si sos miembro o owner del wallet
drop policy if exists "wm_select" on wallet_members;
create policy "wm_select" on wallet_members for select
  using (public.is_wallet_member(wallet_id, auth.uid()));

drop policy if exists "wm_insert_admin" on wallet_members;
create policy "wm_insert_admin" on wallet_members for insert
  with check (
    exists (select 1 from wallets w where w.id = wallet_id and w.owner_id = auth.uid())
  );

drop policy if exists "wm_delete_admin" on wallet_members;
create policy "wm_delete_admin" on wallet_members for delete
  using (
    exists (select 1 from wallets w where w.id = wallet_id and w.owner_id = auth.uid())
  );

-- expenses: visibles si sos miembro del wallet
drop policy if exists "exp_select" on expenses;
create policy "exp_select" on expenses for select
  using (public.is_wallet_member(wallet_id, auth.uid()));

drop policy if exists "exp_insert" on expenses;
create policy "exp_insert" on expenses for insert
  with check (public.is_wallet_member(wallet_id, auth.uid()) and paid_by = auth.uid());

drop policy if exists "exp_update" on expenses;
create policy "exp_update" on expenses for update
  using (public.is_wallet_member(wallet_id, auth.uid()));

drop policy if exists "exp_delete" on expenses;
create policy "exp_delete" on expenses for delete
  using (public.is_wallet_member(wallet_id, auth.uid()));

-- expense_splits: visibles si sos miembro del wallet del expense
drop policy if exists "es_select" on expense_splits;
create policy "es_select" on expense_splits for select
  using (
    exists (
      select 1 from expenses e
      where e.id = expense_id and public.is_wallet_member(e.wallet_id, auth.uid())
    )
  );

drop policy if exists "es_modify" on expense_splits;
create policy "es_modify" on expense_splits for all
  using (
    exists (
      select 1 from expenses e
      where e.id = expense_id and public.is_wallet_member(e.wallet_id, auth.uid())
    )
  );

-- wallet_invites: invitador o destinatario por email
drop policy if exists "inv_select" on wallet_invites;
create policy "inv_select" on wallet_invites for select
  using (
    invited_by = auth.uid()
    or email = (select email from profiles where id = auth.uid())
  );

drop policy if exists "inv_insert" on wallet_invites;
create policy "inv_insert" on wallet_invites for insert
  with check (invited_by = auth.uid());
```

### 5. Correr SQL en Supabase

1. Dashboard → SQL Editor → New query
2. Pegar `schema.sql` → Run
3. Pegar `policies.sql` → Run
4. Verificar en Table Editor que aparecen las 7 tablas y `currencies` tiene 4 rows

### 6. Crear `app/lib/supabase.ts`

```ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(url, anon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 7. Crear `app/lib/format.ts`

```ts
export function fmtGs(n: number): string {
  return `₲ ${Math.abs(Math.round(n)).toLocaleString('es-PY')}`;
}

export function fmtGsSigned(n: number): string {
  if (n < 0) return `− ${fmtGs(n)}`;
  if (n > 0) return `+ ${fmtGs(n)}`;
  return fmtGs(0);
}

export function fmtGsCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (abs >= 1_000_000) return `${sign}₲ ${(abs / 1_000_000).toLocaleString('es-PY', { maximumFractionDigits: 1 })}M`;
  if (abs >= 1_000)     return `${sign}₲ ${(abs / 1_000).toLocaleString('es-PY', { maximumFractionDigits: 0 })}k`;
  return `${sign}${fmtGs(abs)}`;
}
```

### 8. Smoke test desde la app

Modificar `app/index.tsx` temporalmente:

```tsx
import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { theme } = useTheme();
  const [status, setStatus] = useState('loading...');
  useEffect(() => {
    supabase.from('currencies').select('code, symbol, name').then(({ data, error }) => {
      if (error) setStatus(`ERROR: ${error.message}`);
      else setStatus(`OK: ${data?.map(c => c.code).join(', ')}`);
    });
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, padding: 24 }}>
      <Text style={{ color: theme.colors.textPrimary, textAlign: 'center' }}>{status}</Text>
    </View>
  );
}
```

## Validación

- App muestra `OK: PYG, USD, ARS, EUR`
- Si muestra ERROR, verificar `.env` (recordar que cambios en `.env` requieren reiniciar `npx expo start --clear`)
- En el dashboard de Supabase, abrir Authentication → Settings → desactivar "Confirm email" para que signup en dev no requiera confirmación de mail (anotar en DECISIONS.md)

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [01.04] 2026-MM-DD — Supabase project, schema, RLS, cliente
- ✅ Project Supabase creado en region X
- ✅ Schema corrido: 7 tablas + currencies seedeadas (PYG/USD/ARS/EUR) + trigger handle_new_user
- ✅ RLS policies aplicadas para todas las tablas
- ✅ Cliente conectado en `app/lib/supabase.ts` con AsyncStorage adapter
- ✅ Helpers `app/lib/format.ts` (fmtGs, fmtGsSigned, fmtGsCompact)
- ✅ Confirm email desactivado en dev
- 📁 Tocados: `app/lib/supabase.ts`, `app/lib/format.ts`, `app/supabase/schema.sql`, `app/supabase/policies.sql`, `app/.env`, `app/.env.example`
- 🧪 Verificación: smoke test `OK: PYG, USD, ARS, EUR` desde la app
```

### Update `bitacora/DECISIONS.md`
- ADR: Confirm email desactivado en dev (re-activar antes de release)
- ADR: usamos trigger SQL para crear `profiles` row, no insert manual desde cliente (más robusto, evita race con RLS)

### Update `STATE.md`
- **Último módulo completado:** 04-supabase-client
- **Próximo módulo a ejecutar:** prompts/01-fase-auth/05-screen-login.md
