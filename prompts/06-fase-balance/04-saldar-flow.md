# 06.04 — Flujo "Marcar como saldado"

## Objetivo
Permitir al usuario registrar una transferencia que cancele (parcial o totalmente) una deuda visible en la tab Resumen. Modelo de datos: `kind='settlement'` en la tabla `expenses` (ver ADR a crear: ADR-015).

## Tareas

### 1. SQL migration `app/supabase/balance_migration.sql` (NUEVO)
Idempotente. Hace dos cosas:
```sql
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
```

### 2. RPC
`expenses_rpc_v2.sql` ya valida `p_kind` contra el set permitido vía constraint de la tabla — no requiere cambios. Confirmar leyendo el archivo.

### 3. Tipos TS — `app/lib/types.ts`
```ts
export type ExpenseKind = 'expense' | 'income' | 'settlement';
```

### 4. Algoritmo — `app/lib/balance.ts`
`computeNets` ya considera kind 'settlement' como equivalente a 'expense' (ver módulo 06.01). Confirmar que sigue funcionando.

### 5. Componente `SaldarSheet` — `app/components/SaldarSheet.tsx`
Bottom sheet (patrón `ConfirmDeleteSheet`). Recibe:
```ts
{
  visible: boolean;
  walletId: string;
  fromUserId: string;     // deudor (suele ser current user)
  toUserId: string;       // acreedor
  fromName: string;
  toName: string;
  suggestedAmount: number; // monto pendiente de la deuda (preset)
  onConfirm: (amount: number) => void;
  onClose: () => void;
}
```
- Título: "Marcar como saldado"
- Texto: `"${fromName} le pagó a ${toName}"`
- AmountInput preseteado con `suggestedAmount` (editable — caso de pago parcial).
- Validación: amount > 0 y <= suggestedAmount (o un poco más, para tolerar redondeos).
- Botón confirm: "Registrar" (color accent verde).

### 6. Wire-up en TransferLine
Cuando el usuario tap "Marcar como saldado" en una `TransferLine`:
1. Abre `SaldarSheet` con prefill.
2. En `onConfirm(amount)`: llamar a `useExpenses.create({ wallet_id, description: 'Pago entre miembros', amount, category: 'other', kind: 'settlement', paid_by: fromUserId, splits: [{user_id: toUserId, percentage: 100, amount}] })`.
3. Realtime subscription refresca; balance se recalcula automáticamente; la transferencia desaparece o se reduce.

### 7. Filtrar settlements del listado de gastos
En `app/components/ExpenseRow.tsx` o en el filtro previo en `wallet/[id].tsx` tab Gastos: excluir `kind === 'settlement'` del listado principal (no son gastos, son pagos entre miembros). Mostrarlos en una sección aparte si querés (puede ser placeholder Fase 6.1).

## Validación
- Usuario aplica el SQL en Dashboard.
- En wallet team: ver una deuda → tap "Marcar como saldado" → confirmar monto sugerido → la transferencia desaparece de la lista.
- Pago parcial: si saldo es ₲ 50.000 y registrás ₲ 30.000, queda ₲ 20.000 pendiente.
- `npm run typecheck` limpio.

## Bitácora
- Entry `[06.04]` en CHANGELOG.
- ADR-015 en DECISIONS.md ("kind='settlement' en expenses para registrar pagos entre miembros").
- TASKS.md: agregar SQL pendiente `balance_migration.sql`.
- Commit `feat(balance)[06.04]: marcar como saldado + kind=settlement`.

## Pendiente al usuario
Aplicar `app/supabase/balance_migration.sql` en Supabase Dashboard.
