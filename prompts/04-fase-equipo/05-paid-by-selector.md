# 04.05 — paid_by selector en Agregar Gasto

## Objetivo
Cuando la wallet seleccionada es de tipo 'team' y tiene más de 1 miembro, habilitar el campo "Pagado por" como un selector en lugar de texto fijo "Vos". El usuario puede elegir quién pagó entre los miembros del wallet.

## Pre-requisitos
- 04.04 cerrado (necesitamos `membersByWallet` ya cacheado)

## Cambios actuales (referencia)
En `app/(app)/expense/new.tsx`, el FormRow "PAGADO POR" muestra el nombre del usuario actual y no es tappable. El valor `paid_by` en el schema siempre es `user.id`.

## Cambios

### `schemas/expense.ts`
`paid_by` ya es `z.string().uuid()`. No cambia.

### `app/(app)/expense/new.tsx`
1. **Obtener miembros**: `const members = useWallets((s) => selectedWalletId ? s.membersByWallet[selectedWalletId] ?? [] : []);`
2. **Condición tappable**: si `wallet.type === 'team' && members.length > 1` → el FormRow "PAGADO POR" se vuelve tappable y abre un `MemberPickerSheet`
3. **Estado `paidByUserId`**: inicializar con `user.id`. Al cambiar, actualizar el valor del campo `paid_by` del form con `setValue('paid_by', selectedUserId)`.
4. **En modo edit**: si ya hay un `paid_by` en el gasto existente, precargar con ese valor.

### `components/MemberPickerSheet.tsx` (nuevo)
Similar a `CategoryPicker` pero para miembros:
- Props: `visible`, `members: WalletMember[]`, `selected: string`, `onSelect: (userId: string) => void`, `onClose`
- Lista de miembros con `Avatar` 40px + nombre + check si está seleccionado
- "Vos" aparece como primer item (con tu userId marcado)

### FormRow "PAGADO POR" en modo team
- Trailing: `<Avatar name={selectedMemberName} size={26} />` (igual que antes)
- Si tappable: `ChevronRight` visible también
- Si wallet personal o 1 solo miembro: sin ChevronRight, sin onPress (igual que Fase 3)

## Microcopy (literal)
- Label: `"PAGADO POR"`
- Sheet title: `"¿Quién pagó?"`
- Item "Vos": `"Vos"` si es el usuario actual

## Validación
- Wallet personal → campo no tappable (igual Fase 3)
- Wallet equipo con 1 miembro → campo no tappable
- Wallet equipo con 2+ miembros → tappable, abre sheet, puede elegir otro miembro
- Guardar gasto con otro miembro → `paid_by` guardado correctamente en Supabase
- `tsc --noEmit` limpio

## Cierre
```markdown
## [04.05] YYYY-MM-DD — paid_by selector en Agregar Gasto
- ✅ Campo PAGADO POR tappable solo para wallets team con >1 miembro
- ✅ MemberPickerSheet con lista de miembros
- ✅ paid_by se guarda con el userId seleccionado
- 📁 Tocados: expense/new.tsx, components/MemberPickerSheet.tsx
```
