# 05.03 — Modo Partes Iguales (=)

## Objetivo
Renderizar la lista de miembros de la wallet y dividir el monto del gasto equitativamente entre los seleccionados.

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-add-expense.jsx` (componente `SplitRow`)

## Tareas
1. Crear el componente `SplitRow.tsx` siguiendo el mock JSX (avatar, nombre, texto de %, input de monto/%).
2. En `expense/new.tsx`, si `split_mode === 'equal'`:
   - Mostrar la lista de todos los miembros de la wallet.
   - Permitir excluir a un miembro del gasto (con un toggle o checkbox en el `SplitRow`).
   - Calcular dinámicamente el monto para cada miembro activo: `amount / miembros_activos`.
   - Actualizar el campo `splits` del formulario con estos valores exactos.
3. El `SplitRow` en modo `=` es *read-only* para los montos numéricos. Solo se puede togglear la participación.

## Validación
- Ingresar ₲ 100.000, hay 4 miembros → cada uno muestra ₲ 25.000 y 25%.
- Si desmarco a uno, los 3 restantes muestran ₲ 33.333 y 33%.

## Cierre
Actualizar STATE.md, CHANGELOG.md, TASKS.md.
