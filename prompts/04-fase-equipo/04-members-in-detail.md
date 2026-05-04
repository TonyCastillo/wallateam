# 04.04 — Miembros en Detalle de Wallet

## Objetivo
En el Detalle de una wallet team:
1. Mostrar avatares overlap en el header (hasta 4 + "+N")
2. Habilitar el tab "Miembros" con lista de miembros + botón "Invitar"
3. El botón "Invitar" genera un invite y muestra el link para compartir

## Pre-requisitos
- 04.02 y 04.03 cerrados

## Cambios

### `stores/wallets.ts`
- Agregar selector o acción `fetchMembers(walletId)` que hace:
  ```ts
  supabase.from('wallet_members').select('*, profiles(id, full_name, avatar_url)').eq('wallet_id', walletId)
  ```
- Cachear en `membersByWallet: Record<string, WalletMember[]>`

### `lib/types.ts`
Ampliar `WalletMember`:
```ts
export interface WalletMember {
  id: string;
  wallet_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  profile?: { id: string; full_name: string; avatar_url: string | null };
}
```

### `components/AvatarStack.tsx` (nuevo)
Stack de avatares con overlap:
- Props: `members: WalletMember[]`, `max?: number` (default 4)
- Renderiza `<Avatar>` con `marginLeft: -10` excepto el primero
- Si hay más de `max`, último slot es `+N` en gray
- Uso: en el header del Detalle (titleRow, debajo del chip Personal/Equipo)

### `app/(app)/wallet/[id].tsx`
1. **Header**: si `wallet.type === 'team'`, mostrar `<AvatarStack members={members} max={4} />` en el `titleRow`
2. **Tab Miembros**: dejar de mostrar placeholder "Próximamente — Fase 4". Mostrar lista real:
   - `FlatList` de miembros con `Avatar` 40px + nombre + chip "Owner"/"Miembro"
   - Botón "Invitar" (outline, ícono `UserPlus`) al fondo o al header de la lista
3. **Botón Invitar**: tap → `useInvites.getState().create(walletId)` → mostrar bottom sheet con el link `wallateam://invite/{code}` + botón "Copiar link" (`Clipboard.setString`)

### Dependencia
```bash
# Si Clipboard no está, usar expo-clipboard:
npx expo install expo-clipboard
```

## Microcopy (literal)
- Header section: `"Miembros"`
- Roles: `"Owner"` / `"Miembro"`
- Botón: `"Invitar"`
- Sheet: `"Compartí este link para invitar"`
- `"Copiar link"`
- `"Link copiado al portapapeles"`

## Validación
- Wallet personal → sin AvatarStack, tab Miembros disabled
- Wallet equipo → AvatarStack visible en header, tab Miembros activo con lista
- Tap Invitar → genera invite, muestra link, Copiar funciona
- `tsc --noEmit` limpio

## Cierre
```markdown
## [04.04] YYYY-MM-DD — Miembros en Detalle Wallet
- ✅ AvatarStack en header para wallets team
- ✅ Tab Miembros con lista real (nombre, rol)
- ✅ Botón "Invitar" genera invite_code y muestra link
- ✅ Copiar link al portapapeles
- 📁 Tocados: wallet/[id].tsx, components/AvatarStack.tsx, stores/wallets.ts
```
