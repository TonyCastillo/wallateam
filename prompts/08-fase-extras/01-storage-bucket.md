# 08.01 — Supabase Storage bucket + helper de upload

## Objetivo
Crear el bucket `expense-photos` en Supabase, sus RLS policies, y un helper `uploadExpensePhoto()` que el form de gasto va a usar en 08.02.

## Pre-requisitos
- Fase 6 cerrada (06.99 done).
- Cliente Supabase activo (`@/lib/supabase`).
- Variables de entorno `EXPO_PUBLIC_SUPABASE_URL` + key configuradas.

## Contexto necesario
- `app/lib/supabase.ts` — cliente actual.
- `app/lib/types.ts` — `Expense` ya tiene `photo_url: string | null`.
- Patrón de SQL setup: ver `app/supabase/schema.sql` y `app/supabase/policies.sql` para estilo.

## Tareas

### 1. SQL: `app/supabase/storage_setup.sql`

Idempotente. Crea bucket privado y policies.

```sql
-- ============================================================================
-- Storage setup (Fase 8.01) — bucket expense-photos + RLS
-- Correr en Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- 1. Bucket privado (idempotente)
insert into storage.buckets (id, name, public)
values ('expense-photos', 'expense-photos', false)
on conflict (id) do nothing;

-- 2. Policies sobre storage.objects (RLS ya está habilitada por Supabase)
-- Path naming convention: {user_id}/{expense_id}/{filename}
-- storage.foldername(name) devuelve un text[] con los segmentos del path.

drop policy if exists "photo_select_own" on storage.objects;
create policy "photo_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'expense-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "photo_select_wallet_member" on storage.objects;
create policy "photo_select_wallet_member" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'expense-photos'
    and exists (
      select 1
      from expenses e
      join wallet_members wm on wm.wallet_id = e.wallet_id
      where e.id::text = (storage.foldername(name))[2]
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "photo_insert_own" on storage.objects;
create policy "photo_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'expense-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "photo_update_own" on storage.objects;
create policy "photo_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'expense-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "photo_delete_own" on storage.objects;
create policy "photo_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'expense-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 2. Helper: `app/lib/storage.ts`

```ts
import { supabase } from './supabase';

const BUCKET = 'expense-photos';

export async function uploadExpensePhoto(opts: {
  localUri: string;
  userId: string;
  expenseId: string;
}): Promise<string> {
  const ts = Date.now();
  const path = `${opts.userId}/${opts.expenseId}/${ts}.jpg`;

  // En RN, hay que pasar { uri, name, type } como FormData-like.
  // Supabase JS v2 acepta Blob o FormData; en RN se usa el patrón fetch+blob:
  const res = await fetch(opts.localUri);
  const blob = await res.blob();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });
  if (error) throw error;
  return path;
}

export async function getSignedUrl(path: string, expiresInSec = 60 * 60 * 24): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteExpensePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
```

### 3. Instalar `expo-image-picker`
```bash
cd app
npx expo install expo-image-picker
```
Agregar al plugins array en `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Necesitamos acceso a tus fotos para adjuntar el ticket del gasto.",
          "cameraPermission": "Necesitamos acceso a la cámara para sacar la foto del ticket."
        }
      ]
    ]
  }
}
```

## Validación
- `npm run typecheck` limpio.
- El usuario corre `storage_setup.sql` en Supabase Dashboard.
- En el dashboard: Storage → debe aparecer el bucket `expense-photos` como privado.
- Smoke test rápido (opcional, solo si tenés ganas de probar antes de 08.02): en una pantalla de debug, llamar `uploadExpensePhoto({ localUri: 'file://...', userId, expenseId: 'test' })` y verificar que sube.

## Bitácora
- Entry `[08.01]` en CHANGELOG. Tocados: `app/supabase/storage_setup.sql`, `app/lib/storage.ts`, `app/app.json`, `app/package.json` (nueva dep).
- Anotar en `STATE.md` que `storage_setup.sql` es **SQL pendiente de aplicar** (igual que el resto del listado).
- Commit `feat(extras)[08.01]: bucket expense-photos + helper de upload`.
