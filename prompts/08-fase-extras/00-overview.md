# Fase 8 — Extras

## Objetivo
Cerrar el MVP con dos features de alto valor que estaban diferidos al final del roadmap:

1. **Foto del ticket** — adjuntar una imagen a un gasto (cámara o galería) y subirla a Supabase Storage. La columna `expenses.photo_url` ya existe en el schema desde Fase 1 — esta fase la activa end-to-end.
2. **Charts mensuales** — reemplazar el placeholder "Próximamente — Fase 8" del tab Resumen en wallets `type='personal'` por un resumen visual: gasto mensual (últimos N meses) + distribución por categoría (donut). El tab Resumen en wallets `type='team'` queda intacto (eso es Balance de Fase 6).

## Decisiones tomadas

- **Storage:** un solo bucket `expense-photos` privado. Naming: `{user_id}/{expense_id}/{timestamp}.jpg`. RLS permite SELECT/INSERT/UPDATE/DELETE solo al `owner` del path (`auth.uid()::text = (storage.foldername(name))[1]`). En wallets team, los demás miembros leen vía signed URLs (TTL corto generado en el cliente al renderizar) — no necesitamos un bucket público.
- **Foto opcional:** ningún gasto la requiere. Si está, se muestra; si no, no aparece. Esto descarta migración de datos existentes.
- **Charts sin libs externas:** se usa `react-native-svg` (ya en stack) + `Path`/`Rect`/`Circle` manuales. Cero deps nuevas. Dos componentes: `MonthlyBarChart` (6 últimos meses, barras verticales con scale linear) y `CategoryDonut` (un mes, donut con leyenda al costado). Suficiente para MVP — si en el futuro se necesita interactividad/animación rica, evaluar `victory-native` o `react-native-skia`.
- **Tab Resumen personal:** muestra (en orden) el monto total del mes actual destacado, el `MonthlyBarChart` con los últimos 6 meses, y el `CategoryDonut` del mes seleccionado (default = mes actual). El usuario puede tocar una barra del bar chart para cambiar el mes seleccionado del donut.
- **Push notifications + recurrentes:** **out of scope.** Se reevalúan después de validar el MVP en uso real. (`expo-notifications` agrega complejidad de permisos, device tokens, Supabase Edge Function para trigger; gastos recurrentes requiere cron job.)
- **Multimoneda (Fase 7):** **diferida indefinidamente.** Ver `prompts/07-fase-multimoneda/DEFERRED.md`. Toda esta fase asume PYG.

## Módulos

| # | Nombre | Descripción breve |
|---|---|---|
| 01 | storage-bucket | Crear bucket `expense-photos` en Supabase + RLS policies + `app/supabase/storage_setup.sql`. Helper `uploadExpensePhoto(localUri, expenseId)` en `app/lib/storage.ts`. |
| 02 | foto-form | En `expense/new.tsx` (create + edit), nuevo `PhotoPicker` con preview + acción "Sacar foto" / "Elegir de galería". Upload al guardar el gasto (después del insert, update `photo_url`). |
| 03 | foto-viewer | En `ExpenseRow`, thumbnail 36×36 con borde si hay `photo_url`. En el detalle del gasto, foto a ancho completo. `PhotoViewer` modal (tap para abrir, swipe down para cerrar). Signed URLs generadas on-demand. |
| 04 | charts-data | En `app/lib/stats.ts`, dos hooks puros derivados del store: `useMonthlyTotals(walletId, monthsBack=6)` y `useCategoryTotals(walletId, year, month)`. Cero deps. Solo wallets personal. |
| 05 | charts-ui | Dos componentes con `react-native-svg`: `MonthlyBarChart` (barras verticales con highlight de mes seleccionado) y `CategoryDonut` (donut + leyenda con label + monto + %). Empty states. |
| 06 | resumen-personal | Reemplazar el placeholder `if (wallet.type === 'personal')` del tab Resumen por la nueva pantalla con monto del mes + `MonthlyBarChart` + `CategoryDonut`. Estado local `selectedMonth`. |
| 99 | close-phase | Smoke test E2E (subir foto, verla en otro dispositivo, ver charts con datos reales), commit de cierre, marcar Fase 8 = MVP COMPLETO en STATE/README. |

## Stack a usar

- **Foto:** `expo-image-picker` (sí, dep nueva — `npx expo install expo-image-picker`). Compresión: la default del picker (`quality: 0.7`) alcanza para tickets. No usamos `expo-camera` (más complejo, sobra el picker para MVP).
- **Storage:** `supabase.storage.from('expense-photos').upload(...)` y `.createSignedUrl(...)`. Path inputs: `{user_id}/{expense_id}/{ts}.jpg`.
- **Charts:** `react-native-svg` (ya instalado). Helpers de path/donut puros en TS.

## Supabase

- Bucket nuevo: `expense-photos` (privado).
- Policy en `storage.objects` (RLS) en el archivo `app/supabase/storage_setup.sql`.
- Sin cambios en `expenses` (`photo_url` ya existe desde Fase 1).
- Sin cambios en RPCs.

## Orden de ejecución
Ejecutar módulos en orden numérico. Cada módulo:
1. Hace los cambios.
2. `npm run typecheck` debe pasar limpio.
3. Actualiza CHANGELOG.md con entry `[08.0X]`.
4. Commit puntual con mensaje `feat(extras)[08.0X]: <descripción>`.

Al cerrar fase (99): smoke test E2E (3 cuentas — foto subida en device A se ve en device B), commit `chore(extras)[08.99]: cerrar Fase 8 y MVP`. **No hay Fase 9** — Fase 8 cierra el MVP.

## Riesgos / cosas a vigilar

- **Permisos cámara/galería en iOS:** `Info.plist` necesita strings — `expo-image-picker` los maneja vía `app.json` plugin config. Verificar antes de build.
- **Tamaño del bundle:** `react-native-svg` ya pesa. Si los charts crecen, considerar lazy-load.
- **Signed URL refresh:** TTL recomendado 1h. Si el usuario deja una imagen abierta más tiempo, regenerar al re-foco. Para MVP: TTL 24h y olvidarse — privacidad relativa porque el path tiene UUID no enumerable.
- **Cantidad de gastos por mes:** los hooks de stats agrupan en memoria. Con >1000 gastos/mes (no realista en MVP) consideraríamos cache. Por ahora `useMemo` alcanza.
