# 05.04 — Modo Porcentajes (%)

## Objetivo
Permitir la carga manual de porcentajes para cada miembro, validando que el total sea 100%.

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-add-expense.jsx` (barra de gradiente según pct).

## Tareas
1. En `expense/new.tsx`, si `split_mode === 'percent'`:
   - Mostrar la lista de miembros. Cada `SplitRow` tendrá un `TextInput` numérico para ingresar el porcentaje.
   - El monto en guaraníes se calcula automáticamente en base al porcentaje ingresado.
   - Calcular la suma de todos los porcentajes.
2. Renderizar la barra de progreso de cada `SplitRow` con un width basado en el `pct` ingresado.
3. Mostrar en el footer "Total asignado: X% · ₲ Y". Si `X !== 100`, mostrar en color rojo (`danger`) y deshabilitar el botón "Guardar gasto".

## Validación
- Ingresar 50%, 30%, 20% → Footer dice "100%", botón "Guardar" activo. Montos calculados correctamente.
- Ingresar 50%, 30% → Footer dice "80%" en rojo, botón "Guardar" deshabilitado.

## Cierre
Actualizar STATE.md, CHANGELOG.md, TASKS.md.
