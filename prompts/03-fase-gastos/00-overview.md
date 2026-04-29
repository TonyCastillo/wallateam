# Fase 3 — Gastos · Overview

## Alcance
CRUD de gastos (expenses) sobre wallets personales: pantalla **Agregar Gasto**, lista de gastos en Detalle Wallet (reemplaza `EmptyExpenses`), editar/eliminar gastos, y recálculo en vivo de las métricas del Detalle (gastado, restante, % usado).

**Limitaciones intencionales** (mantener foco):

- **Solo wallets type='personal'**: en wallets de equipo no se puede crear gasto todavía (eso es Fase 4).
- **`split_mode='equal'` fijo con un solo split** (`paid_by = user actual`, `expense_splits` con `percentage=100, amount=total`). El selector visual `=  %  ₲` del mock se renderiza pero deshabilitado con label "Multi-split: Fase 5".
- **No hay foto de ticket** (Fase 8). El bloque dashed "Adjuntar ticket" se muestra como placeholder con `Alert("Próximamente")`.
- **Categorías**: catálogo cerrado de 8-10 (food, transport, home, shopping, entertainment, health, work, other). Definir en `lib/categories.ts`. Picker simple con grid o sheet.

## Entregables (criterios de done)

Al cerrar esta fase debe poder demostrarse:

1. ✅ En **Detalle Wallet → tab Gastos**, si la wallet tiene expenses, se ven listados ordenados por fecha desc con `ExpenseRow` (icono de categoría + descripción + "Pagó {nombre} · {fecha}" + monto)
2. ✅ Si no hay gastos, sigue apareciendo `EmptyExpenses`
3. ✅ **FAB del Detalle** (botón `+` con color de wallet) abre pantalla **Agregar Gasto**
4. ✅ También se llega a Agregar Gasto desde **Home → quick action "Gasto"** (con sheet/picker para elegir wallet primero) o directo si vino con `?walletId=...`
5. ✅ Form Agregar Gasto: monto grande con máscara `₲ 1.200.000`, descripción + categoría con picker, selector de wallet (chip PERSONAL), fecha (default ahora con time, editable con DateTimePicker), pagado por (auto = user, no editable en Fase 3), sección "Cómo dividir" deshabilitada con label "Multi-split: Fase 5", placeholder de adjuntar ticket
6. ✅ Validación zod: monto > 0, descripción 2-80 chars, categoría requerida, wallet seleccionada
7. ✅ Submit inserta en `expenses` (con `paid_by=user`, `split_mode='equal'`) + insert en `expense_splits` con `(expense_id, user_id, percentage=100, amount=total)`. Vuelve al Detalle.
8. ✅ El gasto recién creado aparece **inmediato** en la lista (cache local actualizado, no requiere reload)
9. ✅ **Editar gasto**: tap en una fila → abre Agregar Gasto en modo "edit" precargado. Submit actualiza la row.
10. ✅ **Eliminar gasto**: long-press en fila o swipe-to-delete → confirmación → DELETE row (cascade borra split via FK)
11. ✅ Métricas del header del Detalle se recalculan: `gastado = sum(amount)`, `restante = initial_balance - gastado`, `% usado = gastado/initial_balance`. Reemplaza el placeholder de ADR-009.
12. ✅ Subscription realtime al canal `expenses-changes` (similar al de wallets) — opcional pero recomendado
13. ✅ Pull-to-refresh en Detalle recarga gastos
14. ✅ Empty state, loading state, error state en lista
15. ✅ Bitácora actualizada y commit por módulo

## Pre-requisitos

- ✅ Fase 2 cerrada (CRUD de wallets, Detalle con `EmptyExpenses` placeholder, FAB con Alert)
- Tabla `expenses` y `expense_splits` ya existen en Supabase (creadas en Fase 1.04)
- RLS para expenses ya configurada (`exp_select`, `exp_insert`, `exp_update`, `exp_delete`)

## Módulos en orden

| # | Módulo | Tiempo estim. | Bloquea siguiente |
|---|---|---|---|
| 01 | [01-expense-store.md](01-expense-store.md) | 35 min | Sí |
| 02 | [02-expense-row-list.md](02-expense-row-list.md) | 40 min | No (paralelizable con 03) |
| 03 | [03-screen-add-expense.md](03-screen-add-expense.md) | 80 min | Sí |
| 04 | [04-edit-delete-expense.md](04-edit-delete-expense.md) | 40 min | Sí |
| 05 | [05-recalc-metrics.md](05-recalc-metrics.md) | 25 min | Sí |
| 06 | [06-validate-vs-mock.md](06-validate-vs-mock.md) | 25 min | Sí |
| 99 | [99-close-phase.md](99-close-phase.md) | 10 min | — |

## Mocks ground truth

- **Agregar Gasto**: [`design_handoff_wallateam_mvp/lib/screen-add-expense.jsx`](../../design_handoff_wallateam_mvp/lib/screen-add-expense.jsx)
- **Lista de gastos** (sección "Gastos" del Detalle): [`design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx`](../../design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx) — buscar la lista con icon + descripción + "Pagó X · fecha" + chip split + monto
- **Primitives**: [`design_handoff_wallateam_mvp/lib/wallateam-ui.jsx`](../../design_handoff_wallateam_mvp/lib/wallateam-ui.jsx) — `WTAvatar`, `Icon`, `FormRow` (en el screen mismo)

## Modelo de datos (recordatorio)

```sql
expenses (
  id uuid PK,
  wallet_id uuid FK wallets,
  description text,
  amount numeric(18,2),         -- siempre positivo
  category text,                 -- 'food', 'transport', etc.
  paid_by uuid FK profiles,
  occurred_at timestamptz,
  photo_url text,                -- nullable, Fase 8
  note text,                     -- nullable
  split_mode text,               -- 'equal' fijo en Fase 3
  created_at timestamptz
)

expense_splits (
  expense_id uuid FK expenses,
  user_id uuid FK profiles,
  percentage numeric(5,2),       -- 100.00 en Fase 3
  amount numeric(18,2),          -- = expenses.amount en Fase 3
  PRIMARY KEY (expense_id, user_id)
)
```

## Salida esperada al cerrar fase

- Componentes nuevos: `ExpenseRow`, `CategoryPicker`, `AmountInput` (input grande con ₲ + máscara), `FormRow`, `WalletPickerSheet` (BottomSheet o modal)
- Store `stores/expenses.ts` con `useExpenses` (byWallet, create, update, remove, totalsByWallet)
- Pantalla `app/(app)/expense/new.tsx` (con query param opcional `?walletId=...`) y `app/(app)/expense/[id]/edit.tsx`
- Schema zod en `app/schemas/expense.ts`
- Catálogo `app/lib/categories.ts` con id/label/icon/color
- `bitacora/STATE.md` apuntando a `prompts/04-fase-equipo/00-overview.md`
- Commit final: `feat(gastos): fase 3 - CRUD de expenses con recálculo de métricas en Detalle`

## Diferidos a fases siguientes (NO implementar aunque aparezcan en mocks)

- Multi-split (= / % / ₲ con varios miembros) → Fase 5
- Foto de ticket → Fase 8
- Notas largas (`expenses.note`) → puede agregarse acá si sobra tiempo, sino Fase 8
- Categorías custom creadas por el user → Fase 8
- Cambio de `paid_by` (asignar a otro user) → Fase 4 (requiere wallets de equipo)
