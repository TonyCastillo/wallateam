# 05.02 — UI Toggle de Modos de Split

## Objetivo
Quitar el bloqueo visual de "Fase 5" en Agregar Gasto y permitir seleccionar el modo de split (`=`, `%`, `₲`).

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-add-expense.jsx` (componente `SplitMode`)

## Tareas
1. En `app/(app)/expense/new.tsx`:
   - Ubicar la sección "Cómo dividir".
   - Quitar el `opacity: 0.4` y el mensaje "Multi-split disponible en Fase 5".
2. Crear un componente interactivo para los modos (`=`, `%`, `₲`), conectado a `watch('split_mode')` y `setValue('split_mode', ...)` del formulario.
3. El toggle solo debe ser visible/activo cuando `isTeamWallet === true` y `!isIncome` (los ingresos no se dividen).
4. El contenedor general debe mostrar el texto "Por partes iguales", "Por porcentajes personalizados" o "Por montos fijos" según el modo activo.

## Validación
- En una wallet team, tocar `=`, `%`, y `₲` cambia el modo en el formulario y muestra la selección visualmente correcta (color primario para activo).

## Cierre
Actualizar STATE.md, CHANGELOG.md, TASKS.md.
