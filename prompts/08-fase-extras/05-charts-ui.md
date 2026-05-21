# 08.05 — Componentes de chart (BarChart + Donut)

## Objetivo
Crear dos componentes de visualización con `react-native-svg` (ya en stack), sin dependencias nuevas: `MonthlyBarChart` para tendencia mensual y `CategoryDonut` para distribución por categoría.

## Pre-requisitos
- 08.04 completado (hooks `useMonthlyTotals` / `useCategoryTotals`).
- `react-native-svg` ya está instalada (Fase 1).

## Contexto necesario
- `app/lib/stats.ts` — tipos `MonthlyTotal` y `CategoryTotal`.
- `app/theme/tokens.ts` — colors, spacing, typography.
- Patrón SVG existente en la app: `app/components/WTLogo.tsx`, `app/components/RadialHero.tsx`.

## Tareas

### 1. `MonthlyBarChart`
`app/components/MonthlyBarChart.tsx`:

```ts
interface Props {
  data: MonthlyTotal[];                       // length usualmente 6
  selectedYyyymm?: string;                    // mes destacado (mes seleccionado del donut)
  onSelectMonth?: (yyyymm: string) => void;
  height?: number;                            // default 140
}
```

Layout:
- Svg width responsive (medir con `onLayout` o pasar como prop). Para MVP: usar `Dimensions.get('window').width - 40` (padding del container).
- Barras verticales, gap horizontal proporcional. Width de barra ≈ `(totalWidth - gaps) / data.length`.
- Y-scale linear desde 0 hasta el max de `spent` con padding 10% top. Si todo es 0, mostrar empty state ("Sin datos del período").
- Color de barra: `theme.colors.primary` con `fillOpacity={0.85}`. Si la barra está seleccionada (`item.yyyymm === selectedYyyymm`), `theme.colors.secondary` y full opacity.
- Labels x-axis: `item.label` (e.g. "May") debajo de cada barra, 10px textSecondary, capitalize.
- Tap sobre una barra: `onSelectMonth?.(item.yyyymm)`. Usar `Pressable` superpuesto o `onPress` en `<Rect>` (react-native-svg lo soporta).
- Tooltip opcional (post-MVP): saltar para no complicar.

Empty state: si `data.every(d => d.spent === 0)`, renderizar un texto centrado "Sin gastos en los últimos 6 meses" 13px textSecondary, sin barras.

### 2. `CategoryDonut`
`app/components/CategoryDonut.tsx`:

```ts
interface Props {
  data: CategoryTotal[];          // ordenado desc por amount
  size?: number;                  // default 180 — el "anillo" cuadrado
  thickness?: number;             // default 28
}
```

Layout:
- `Svg` cuadrado de `size × size`.
- Donut con N segmentos en arco. Cada segmento es un `<Path>` con `d` calculado por helper `describeArc(cx, cy, r, startAngle, endAngle)`. Si `data.length === 1`, full circle (`endAngle - startAngle === 360`).
- Centro: `cx = cy = size/2`. `r = (size - thickness) / 2`. `strokeWidth = thickness`. `fill = "none"`. `stroke = item.color`. `strokeLinecap = "butt"`.
- En el centro del donut: total del mes con `fmtGs` 16px bold. Debajo: "este mes" 11px textSecondary.
- A la derecha del donut (mismo row, gap 16): leyenda. Para cada item:
  - Dot 8×8 con `item.color`.
  - Label 12px medium textPrimary.
  - Monto 12px regular textSecondary alineado a la derecha.
  - Porcentaje en una segunda línea: `12.5%` 10px textSecondary.
- Limitar leyenda a top 5 items + "Otros" si hay más (sumar amounts y percentages restantes).

Empty state: si `data.length === 0` o `total === 0`, renderizar texto centrado "Sin gastos este mes" + ícono `PieChart` desaturado encima. Sin donut.

### 3. Helper de geometría (interno o en lib)
```ts
// Devuelve el path 'd' para un arco de un donut centrado en (cx,cy) de radio r,
// desde startAngle a endAngle (grados, 0 = arriba, sentido horario).
function describeArc(cx: number, cy: number, r: number, start: number, end: number): string;
```
Implementación estándar con `Math.cos/sin` y conversión deg→rad. Considerar el caso degenerado de full circle (dividirlo en dos medios arcos para evitar el bug clásico de los SVG arcs cuando start === end).

## Validación
- `npm run typecheck` limpio.
- Renderizar ambos componentes en una pantalla de debug con datos mock:
  - `MonthlyBarChart` con 6 meses, uno seleccionado: la barra seleccionada se diferencia visualmente.
  - `CategoryDonut` con 4 categorías cuyos amounts sumen exactamente al total — los porcentajes deben sumar 100.
  - Empty states: pasar arrays vacíos y verificar que se muestran los textos correctos.

## Bitácora
- Entry `[08.05]` en CHANGELOG. Tocados: `app/components/MonthlyBarChart.tsx`, `app/components/CategoryDonut.tsx` (ambos nuevos).
- Commit `feat(extras)[08.05]: MonthlyBarChart + CategoryDonut`.
