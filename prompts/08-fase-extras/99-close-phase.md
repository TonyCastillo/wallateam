# 08.99 — Cerrar Fase 8 y MVP

## Objetivo
Smoke test E2E de ambas features (foto + charts), commit de cierre, actualización de bitácora marcando MVP completo.

## Tareas

### 1. Smoke test E2E

#### Track A — Foto del ticket (2 cuentas, wallet team)
1. Cuenta A crea wallet team "Mercado", invita a B.
2. A crea un gasto ₲ 50.000 y adjunta una foto (cámara o galería).
3. A guarda → vuelve a la lista → ve el thumbnail 36×36 en el ExpenseRow.
4. A tap en el thumbnail → `PhotoViewer` abre la foto a pantalla completa → tap X → cierra.
5. **Cuenta B** abre la misma wallet en su device → ve el mismo thumbnail y puede abrir el viewer (RLS de wallet_member funcionando).
6. A edita el gasto → reemplaza la foto por otra → guarda → al volver, el thumbnail muestra la nueva.
7. A elimina el gasto → el archivo desaparece del Storage (verificar en Dashboard).

#### Track B — Charts (wallet personal)
1. En una wallet personal de la cuenta A, agregar gastos repartidos en distintos meses y categorías (al menos 3 meses con datos y 3 categorías distintas en el mes actual).
2. Abrir el tab Resumen → ver header con monto del mes actual.
3. `MonthlyBarChart` muestra 6 barras, la del mes actual destacada.
4. `CategoryDonut` muestra los segmentos correctos. Los porcentajes en la leyenda suman 100%.
5. Tap en una barra de un mes anterior → el header y el donut cambian al mes seleccionado.
6. Crear una wallet personal nueva (sin gastos) → empty states de ambos charts visibles.

### 2. Verificación final
- `npm run typecheck` limpio.
- `npm start` arranca Metro sin warnings nuevos.
- En el dashboard de Supabase: bucket `expense-photos` con los archivos subidos en el smoke; al borrar un gasto, el archivo desaparece.

### 3. Commit de cierre
```bash
git add -A
git commit -m "chore(extras)[08.99]: cerrar Fase 8 y MVP

- foto del ticket: PhotoPicker en form + thumbnail + PhotoViewer + Storage bucket
- charts: useMonthlyTotals + useCategoryTotals + MonthlyBarChart + CategoryDonut
- tab Resumen personal con monto del mes + bar chart + donut por categoría
- MVP completo: 8/8 fases (Fase 7 deferred indefinidamente)"
```

### 4. Actualizar bitácora
- `STATE.md`:
  - **Fase activa:** `MVP COMPLETO` (o sin fase activa).
  - **Próximo módulo:** `—` o "post-MVP: validación en uso real, decidir si reactivar push/recurrentes/multimoneda".
  - Tabla de progreso global: Fase 8 → ✅ Cerrada (7 / 7), Fase 7 → ⏸️ Deferred.
- `CHANGELOG.md`: entry `[08.99]` consolidando el track Foto + Charts + decisión MVP cerrado.
- `TASKS.md`: mover todos los ítems de Fase 8 a Done. Crear sección `## Post-MVP` con: validación con familia real, decisión sobre push/recurrentes/multimoneda, EAS Build production (no preview), publicar en stores.
- `DECISIONS.md`: nuevo ADR si surgió algo no obvio en la fase (por ejemplo, decisión sobre TTL de signed URLs o cache de URLs).

### 5. Pulir README.md (opcional pero recomendado)
- Actualizar la tabla del Roadmap: Fase 7 marcada como "Diferida", Fase 8 ✅ con fecha de cierre.
- Agregar una sección breve "Estado del MVP" arriba del Roadmap explicando que el MVP está cerrado.

## Validación
- ✅ Commit en `git log`.
- ✅ `STATE.md` marca MVP completo.
- ✅ Working tree limpio.
- ✅ La app es usable end-to-end para el caso "control de gastos en familia": crear wallet team, invitar miembros, cargar gastos con foto, ver balance, saldar, y en wallets personales ver el resumen mensual con charts.

## Post-MVP (no parte de 08.99, sólo para no perderlo)
- Push notifications (`expo-notifications` + Edge Function en Supabase).
- Gastos recurrentes (suscripciones/alquileres) — requiere cron de Supabase o Edge Function programada.
- Multimoneda — ver `prompts/07-fase-multimoneda/DEFERRED.md`.
- Export CSV/PDF del wallet.
- Stores: build production de iOS/Android y publicación.
