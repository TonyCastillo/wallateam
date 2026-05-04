# 04.02 — wallet_invites: store + queries

## Objetivo
Crear el store Zustand para invitaciones, las queries Supabase (crear invite, listar por wallet, aceptar invite) y la lógica de generación de `invite_code` (nanoid/random string).

## Pre-requisitos
- 04.01 cerrado
- Tabla `wallet_invites` en Supabase (ya en schema.sql desde Fase 1.04)

## Cambios

### `lib/types.ts`
Agregar:
```ts
export type InviteStatus = 'pending' | 'accepted' | 'revoked';
export interface WalletInvite {
  id: string;
  wallet_id: string;
  invite_code: string;
  created_by: string;
  accepted_by: string | null;
  email: string | null;
  status: InviteStatus;
  expires_at: string | null;
  created_at: string;
}
```

### `stores/invites.ts` (nuevo)
```ts
interface InvitesState {
  byWallet: Record<string, WalletInvite[]>;
  loading: boolean;
  error: string | null;
  fetchByWallet: (walletId: string) => Promise<void>;
  create: (walletId: string) => Promise<WalletInvite>;   // genera invite_code, inserta, retorna invite
  accept: (inviteCode: string) => Promise<void>;          // llama RPC o inserta en wallet_members
  revoke: (inviteId: string) => Promise<void>;
}
```

**`create`**: generar `invite_code` con 8 chars alfanuméricos (`Math.random().toString(36).slice(2,10)`), insertar en `wallet_invites`, agregar al cache.

**`accept`**: dado `invite_code`, hacer SELECT para obtener el invite, insertar en `wallet_members` con el userId actual, marcar invite como 'accepted'. Si ya existe membership → ignorar (idempotente).

### Supabase RLS para `wallet_invites`
Verificar que las policies en `policies.sql` permitan:
- INSERT solo al owner del wallet
- SELECT al creador del invite y al destinatario (o cualquiera con el invite_code → policy `status='pending'`)
- UPDATE (accept) al user que acepta

Si no están, agregar en `policies.sql` y correr en dashboard.

### `app/_layout.tsx`
No es necesario hidratar invites al login — se cargan on-demand cuando se abre el Detalle de una wallet team.

## Verificación
- `tsc --noEmit` limpio
- Desde consola: crear invite para una wallet team → ver row en dashboard de Supabase
- Aceptar invite desde otro user → ver nueva row en `wallet_members`

## Cierre
```markdown
## [04.02] YYYY-MM-DD — wallet_invites store
- ✅ `stores/invites.ts` con fetchByWallet, create, accept, revoke
- ✅ invite_code generado localmente (8 chars alfanuméricos)
- ✅ accept es idempotente (no duplica wallet_members)
- 📁 Tocados: stores/invites.ts, lib/types.ts, supabase/policies.sql (si necesitó ajuste)
```
