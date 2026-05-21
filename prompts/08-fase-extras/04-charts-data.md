# 08.04 — Hooks de estadísticas (datos para charts)

## Objetivo
Crear `app/lib/stats.ts` con dos hooks puros que derivan estadísticas del store de expenses, sin acoplamiento a UI ni dependencias externas. Estos hooks alimentan los charts del módulo 08.05 y la pantalla del 08.06.

## Pre-requisitos
- 08.03 completado (track de foto del ticket terminado).
- `app/stores/expenses.ts` con `list(walletId)` ya operativo.
- `app/lib/categories.ts` con `CATEGORIES` y `anyCategoryById`.

## Contexto necesario
- `app/lib/types.ts` — `Expense.kind` ya puede ser `'expense' | 'income' | 'settlement'`.
- `app/stores/expenses.ts` — selector `list(walletId)`.
- Decisión: para wallets `type='personal'` los gastos son `kind='expense'` o `kind='income'` (ingresos). Settlements solo existen en team.

## Tareas

### 1. Tipos en `app/lib/stats.ts`

```ts
export interface MonthlyTotal {
  /** YYYY-MM, e.g. "2026-05" */
  yyyymm: string;
  /** Etiqueta corta para el chart, e.g. "May" */
  label: string;
  /** Total gastado en el mes (solo kind='expense', sin income ni settlement) */
  spent: number;
  /** Total de ingresos en el mes (kind='income') */
  income: number;
}

export interface CategoryTotal {
  category: string;       // category id (key en CATEGORIES)
  label: string;          // display label
  color: string;          // color de la categoría
  amount: number;
  /** Porcentaje del total del mes (0-100). 0 si el total del mes es 0. */
  percentage: number;
}
```

### 2. `useMonthlyTotals(walletId, monthsBack = 6)`

Hook que:
- Toma los expenses del wallet con `useExpenses(s => s.list(walletId))`.
- Calcula el rango: del mes actual menos `monthsBack - 1` hasta el mes actual (inclusive). Ej: si hoy es 2026-05 y `monthsBack=6` → ['2025-12', '2026-01', ..., '2026-05'].
- Agrupa por `yyyymm = expense.occurred_at.slice(0,7)`.
- Suma `expense.amount` separando por `kind`: 'expense' → `spent`, 'income' → `income`. 'settlement' se ignora (no aplica a personal y en team no se muestra en este chart).
- Garantiza que **todos los meses del rango** aparezcan en el resultado, incluso si están en 0.
- Retorna `MonthlyTotal[]` ordenado ascendente por `yyyymm`.

Label corto en español (formato `Intl.DateTimeFormat('es-PY', { month: 'short' })` y capitalizar primera letra — `Intl` devuelve "may." con punto, sacar el punto).

Wrap en `useMemo` con dependencias `[expenses, monthsBack]`.

### 3. `useCategoryTotals(walletId, year, month)`

- `month` 1-12 (no 0-indexed). El llamador puede pasar el mes seleccionado de la UI.
- Filtra expenses con `occurred_at` dentro de `[year, month]` Y `kind === 'expense'` (descarta income y settlement).
- Agrupa por `category`. Si la categoría no existe en `CATEGORIES`, agruparla como `'other'`.
- Resuelve `label` y `color` vía `anyCategoryById(category, 'expense')` con fallback al token primary si no se encuentra.
- Calcula `percentage = amount / totalDelMes * 100` (0 si total=0).
- Ordena desc por `amount`.
- Retorna `CategoryTotal[]`.

Wrap en `useMemo` con dependencias `[expenses, year, month]`.

### 4. Helpers internos (no exportar)

```ts
function getYyyymm(isoString: string): string {
  return isoString.slice(0, 7); // funciona con timestamptz ISO porque ya está en UTC; ver nota
}
```

> **Nota sobre timezone:** `expense.occurred_at` es `timestamptz` en Supabase, que viene como ISO con zona. En PY (UTC-3 sin DST en Paraguay desde 2024) un gasto cargado a las 23:30 del 31 de mayo local (`2026-06-01T02:30:00Z`) terminaría en junio si hacemos `.slice(0,7)` ingenuo. Para MVP es aceptable (los gastos típicos no son borderline de medianoche). Si en el futuro hay quejas, usar `new Date(iso).toLocaleString('en-CA', { timeZone: 'America/Asuncion', year: 'numeric', month: '2-digit' })`.

### 5. Solo wallets personal — decisión

Estos hooks devuelven datos correctos para cualquier wallet, pero en wallets `type='team'` el tab Resumen muestra el Balance (Fase 6), no charts. Los charts viven sólo en el tab Resumen de wallets `type='personal'`. Los hooks no chequean el type — esa decisión es de la UI que los usa (08.06).

## Validación
- `npm run typecheck` limpio.
- Sanity mental: en un wallet con 3 gastos en mayo (10k, 20k, 30k) y nada en abril → `useMonthlyTotals(walletId, 6)` debe devolver array de 6 elementos con `spent: 60000` en el último y `0` en los previos.
- `useCategoryTotals` con esos 3 gastos en categorías diferentes debe devolver 3 items con porcentajes 16.67% / 33.33% / 50% sumando 100%.

## Bitácora
- Entry `[08.04]` en CHANGELOG. Tocados: `app/lib/stats.ts` (nuevo).
- Commit `feat(extras)[08.04]: hooks useMonthlyTotals y useCategoryTotals`.
