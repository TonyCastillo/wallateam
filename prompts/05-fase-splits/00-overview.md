# Fase 5 — Splits (Cómo dividir)

## Objetivo
Habilitar la sección "Cómo dividir" en la pantalla de Agregar Gasto para wallets compartidas. Permitir dividir los gastos de tres formas: Partes iguales (`=`), Porcentajes (`%`) y Monto fijo (`₲`).

## Mocks ground truth
- `design_handoff_wallateam_mvp/lib/screen-add-expense.jsx` (sección splits activa)

## Módulos

| # | Nombre | Descripción breve |
|---|---|---|
| 01 | Splits store & types | Actualizar store y schema para `split_mode` y el array de splits. |
| 02 | Toggle UI | Componente `SplitModeToggle` en pantalla de agregar gasto (`=`, `%`, `₲`). |
| 03 | Modo Partes Iguales | Lógica y UI para dividir en montos equitativos. |
| 04 | Modo Porcentajes | Inputs numéricos para % y validación de 100%. |
| 05 | Modo Monto Fijo | Inputs numéricos para PYG y validación del total. |
| 06 | Validación visual | Checklist contra mock JSX. |
| 99 | Cerrar fase | Smoke test E2E, commit de cierre. |

## Stack a usar
- React Hook Form (`useFieldArray` o sincronización manual de splits).
- Componentes: `Avatar` y nuevo `SplitRow`.
- Zod para validaciones complejas de array (suma total = monto gasto).

## Supabase
- Usaremos el RPC `create_expense_with_split` que ya permite enviar los splits. Se debe adaptar para recibir el JSON o array correcto.

## Orden de ejecución
Ejecutar módulos en orden numérico. Cada módulo actualiza bitácora al cerrar.
