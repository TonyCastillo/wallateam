# 04.01 — CreateWallet: habilitar type='team'

## Objetivo
Habilitar el selector de tipo en la pantalla Crear Wallet (actualmente "team" está disabled), agregar una sección "Miembros" que aparece cuando type='team', y asegurar que el creador quede registrado como `owner` en `wallet_members` al crear.

## Pre-requisitos
- Fase 3 cerrada
- Schema `wallet_members` y RLS vigentes en Supabase

## Cambios

### `schemas/wallet.ts`
- `newWalletSchema`: ya tiene `type: z.enum(['personal','team'])`. Remover o ignorar el disabled del form.

### `app/(app)/create-wallet.tsx`
1. **Type selector**: desactivar el `disabled` del botón "Equipo". Al seleccionar type='team':
   - Mostrar sección "Miembros" debajo del selector (ver mock)
   - La sección dice: `"Podés invitar miembros después de crear la wallet"` con icono `Users`
2. **onSubmit**: si `type === 'team'`, después de crear la wallet con `useWallets.create()`, insertar en `wallet_members`:
   ```ts
   await supabase.from('wallet_members').insert({
     wallet_id: newWallet.id,
     user_id: user.id,
     role: 'owner',
   });
   ```
   Encapsular esto en la acción `create` del store si es posible, o hacerlo en el componente con un try/catch.

### `stores/wallets.ts` (opcional)
- Si preferís que el store maneje el insert del owner, mover la lógica a la acción `create`.

### `lib/types.ts`
- Agregar `WalletMember`: `{ id, wallet_id, user_id, role: 'owner'|'member', joined_at, profile?: Profile }`

## Microcopy (literal)
- Botón tipo: `"Personal"` / `"Equipo"`
- Sección miembros: `"Miembros"` (header), `"Podés invitar miembros después de crear la wallet"` (body)

## Validación
- Crear wallet Personal → funciona igual que antes
- Crear wallet Equipo → aparece en Home con chip "Equipo", DB tiene row en `wallet_members` con role='owner'
- `tsc --noEmit` limpio

## Cierre
```markdown
## [04.01] YYYY-MM-DD — CreateWallet: type='team' habilitado
- ✅ Selector tipo Personal/Equipo activo
- ✅ Sección "Miembros" visible al seleccionar Equipo
- ✅ Auto-insert owner en wallet_members al crear wallet team
- 📁 Tocados: create-wallet.tsx, stores/wallets.ts, lib/types.ts
```
