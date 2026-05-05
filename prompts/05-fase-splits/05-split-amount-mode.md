# 05.05 — Modo Monto Fijo (₲)

## Objetivo
Permitir la carga manual de montos fijos para cada miembro, validando que la suma coincida con el total del gasto.

## Tareas
1. En `expense/new.tsx`, si `split_mode === 'amount'`:
   - Mostrar la lista de miembros. Cada `SplitRow` tendrá un `TextInput` para ingresar monto en ₲ (idealmente usando una máscara compacta).
   - El porcentaje se calcula automáticamente: `(monto_ingresado / monto_total) * 100`.
   - Calcular la suma de todos los montos fijos ingresados.
2. Mostrar en el footer "Total asignado: 100% · ₲ Suma". Si la suma no coincide con el total de la cabecera, colorear en rojo y deshabilitar el botón de guardado.
3. Manejar el caso especial donde el monto total del gasto en la cabecera es 0 o aún no se ingresó.

## Validación
- Gasto total = ₲ 50.000. Ingresar 20.000 para A y 30.000 para B → Footer verde, botón activo.
- Ingresar 10.000 para B → Footer rojo ("₲ 30.000 / ₲ 50.000"), botón deshabilitado.

## Cierre
Actualizar STATE.md, CHANGELOG.md, TASKS.md.
