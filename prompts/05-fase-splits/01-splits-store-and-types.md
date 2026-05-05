# 05.01 — Splits Store y Types

## Objetivo
Actualizar los types, esquemas Zod y el store de expenses para soportar modos de split y arrays de splits configurables.

## Tareas
1. En `app/lib/types.ts`:
   - Asegurarse que `SplitMode` incluye `'equal' | 'percent' | 'amount'`.
   - Asegurarse que `NewExpenseInput` incluye `split_mode: SplitMode` y `splits: { user_id: string; percentage?: number; amount: number }[]`.
2. En `app/schemas/expense.ts`:
   - Modificar `newExpenseSchema` para requerir `split_mode` (default `'equal'`) y validar el array de `splits`.
   - Las validaciones dinámicas (ej: suma de % == 100) se pueden manejar a nivel del form resolver o schema `refine()`.
3. En `app/stores/expenses.ts`:
   - Asegurarse que el backend y `create_expense_with_split` puede recibir la estructura de `splits` (revisar la firma actual en la DB si requiere cambios).
   - *Nota:* Si la firma de Supabase asume 1 solo pagador por defecto en el backend sin recibir JSON, deberás documentarlo en `bitacora/DECISIONS.md`, crear un nuevo archivo SQL y actualizar el dashboard manual.

## Validación
- `npx tsc --noEmit` pasa limpio con los nuevos types.

## Cierre
Actualizar STATE.md, CHANGELOG.md, TASKS.md.
