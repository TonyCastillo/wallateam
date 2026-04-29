# 05 — Recalcular métricas en Detalle Wallet (y Home)

## Objetivo
Reemplazar el placeholder de Fase 2 (`gastado=0`, `restante=initial_balance`) por el cálculo real basado en `useExpenses.totals(walletId)`. Aplica a:
- Header del Detalle Wallet (Presupuesto / Gastado / Restante / % usado / progress bar)
- BalanceCard del Home (sumar gastos restados al `initial_balance` por wallet → recalcular `personal` y `total`)

Cierra el ADR-009 (placeholder removido).

## Pre-requisitos
- Módulos 03.01..03.04 cerrados (store y CRUD funcionando, datos reales en DB)

## Contexto necesario
- `app/stores/wallets.ts` (hook `useTotalBalance`)
- `app/stores/expenses.ts` (`totals` selector)
- `app/app/(app)/wallet/[id].tsx` (header)
- `app/app/(app)/(tabs)/home.tsx` (BalanceCard)
- `app/components/BalanceCard.tsx`

## Tareas

### 1. Actualizar `useTotalBalance` en `stores/wallets.ts`

Antes (Fase 2):

```ts
export function useTotalBalance(): { personal: number; team: number; total: number } {
  const wallets = useWallets((s) => s.wallets);
  const userId = useAuth((s) => s.user?.id);
  let personal = 0, team = 0;
  wallets.forEach((w) => {
    if (w.type === 'personal' && w.owner_id === userId) personal += w.initial_balance;
    else if (w.type === 'team') team += w.initial_balance;
  });
  return { personal, team, total: personal + team };
}
```

Después (Fase 3) — usar el balance real (initial_balance - gastado):

```ts
import { useExpenses } from './expenses';

export function useTotalBalance(): { personal: number; team: number; total: number } {
  const wallets = useWallets((s) => s.wallets);
  const userId = useAuth((s) => s.user?.id);
  const expensesByWallet = useExpenses((s) => s.byWallet);

  let personal = 0;
  let team = 0;

  wallets.forEach((w) => {
    const spent = (expensesByWallet[w.id] ?? []).reduce((acc, e) => acc + Number(e.amount), 0);
    const balance = Number(w.initial_balance) - spent;
    if (w.type === 'personal' && w.owner_id === userId) personal += balance;
    else if (w.type === 'team') team += balance;
  });

  return { personal, team, total: personal + team };
}
```

**Nota técnica**: este hook debe re-renderizar cuando cambian wallets O expenses. Como ya selecciona ambos, Zustand lo va a triggerar correctamente.

### 2. Hook nuevo `useWalletMetrics(walletId)`

Centralizar el cálculo del Detalle. Agregar en `stores/expenses.ts` o en un archivo nuevo `lib/walletMetrics.ts`:

```ts
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';

export interface WalletMetrics {
  presupuesto: number;
  gastado: number;
  restante: number;
  usedPct: number;          // 0..1
  count: number;
}

export function useWalletMetrics(walletId: string | undefined): WalletMetrics {
  const wallet = useWallets((s) => (walletId ? s.byId(walletId) : undefined));
  const expensesList = useExpenses((s) => (walletId ? s.list(walletId) : []));

  const presupuesto = Number(wallet?.initial_balance ?? 0);
  const gastado = expensesList.reduce((acc, e) => acc + Number(e.amount), 0);
  const restante = presupuesto - gastado;
  const usedPct = presupuesto > 0 ? Math.min(1, gastado / presupuesto) : 0;
  const count = expensesList.length;
  return { presupuesto, gastado, restante, usedPct, count };
}
```

### 3. Actualizar header de `app/app/(app)/wallet/[id].tsx`

Reemplazar las constantes hardcodeadas:

```tsx
// ANTES
const presupuesto = wallet.initial_balance;
const gastado = 0;
const restante = presupuesto - gastado;
const usedPct = 0;

// DESPUÉS
const { presupuesto, gastado, restante, usedPct, count } = useWalletMetrics(wallet.id);
```

El renderizado de las `<Metric>` y `<ProgressBar>` ya usa esas variables. Verificar que el texto debajo del progress muestre `{Math.round(usedPct * 100)}% usado` (sin hardcodear 0).

**Edge case**: si `usedPct > 1` (gastaste más del presupuesto), mostrar la barra al 100% pero el texto puede mostrar "120% usado" en color `danger` o `warning` para alertar.

```tsx
const overBudget = usedPct >= 1;
<Text style={{ color: overBudget ? theme.colors.warning : 'rgba(255,255,255,0.7)' }}>
  {Math.round(usedPct * 100)}% usado · {daysLabel}
</Text>
```

(Sobre fondo gradient blanco, usar warning amarillo o un color cliché; en vez de `danger` rojo que choca con el verde teal del header).

### 4. (Opcional) Indicador de count de gastos

Agregar texto small en el header: `"{count} gastos"`. Útil pero no en el mock — decidir y documentar.

### 5. Refresco coordinado

Cuando se crea/edita/elimina un gasto, el `useExpenses` ya actualiza su cache → `useWalletMetrics` re-evalúa → el header del Detalle y el BalanceCard del Home se re-renderean. Verificar manualmente:

1. Abrir Home → ver balance "₲ 5.000.000" (suma de wallets sin gastos)
2. Crear un gasto de ₲ 200.000 en una wallet → volver al Home
3. Esperar que la BalanceCard se actualice a "₲ 4.800.000"

Si no se actualiza, debuggear: probablemente sea problema de selectores Zustand poco granulares.

### 6. Cleanup del ADR-009

En `bitacora/DECISIONS.md` marcar el ADR-009 como **resuelto**:

```markdown
## ADR-009 · useTotalBalance usa initial_balance ~~(deprecated en Fase 3.05)~~

**Fecha:** 2026-04-28  
**Estado:** ~~Activo~~ **Resuelto el 2026-MM-DD en módulo 03.05**
...
**Resolución:** El hook ahora calcula `balance = initial_balance - sum(expenses.amount)` consumiendo `useExpenses.byWallet`. Mismo aplicable al header del Detalle Wallet vía nuevo hook `useWalletMetrics(walletId)`.
```

### 7. Test E2E del recálculo

Manualmente:

1. Crear wallet "Test recalc" con presupuesto ₲ 1.000.000
2. Detalle muestra: Presupuesto ₲1M, Gastado ₲0, Restante ₲1M, 0% usado
3. Crear gasto ₲ 250.000
4. Detalle: Presupuesto ₲1M, Gastado ₲250k, Restante ₲750k, 25% usado, barra al 25%
5. Crear gasto ₲ 800.000
6. Detalle: Presupuesto ₲1M, Gastado ₲1.05M, Restante ₲−50k (en danger?), 105% usado (mostrar warning)
7. Editar el segundo gasto a ₲ 500.000
8. Detalle: Gastado ₲750k, Restante ₲250k, 75% usado
9. Eliminar el primer gasto
10. Detalle: Gastado ₲500k, Restante ₲500k, 50% usado
11. Volver al Home → BalanceCard muestra el balance actualizado (resta los expenses de todas las wallets)

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ Métricas del header se actualizan al crear/editar/borrar gastos
- ✅ Barra de progreso visualmente correcta
- ✅ Over-budget muestra warning visual
- ✅ Home BalanceCard refleja el balance neto de todas las wallets
- ✅ Texto "X% usado" se actualiza correctamente
- ✅ ADR-009 marcado como resuelto en DECISIONS.md

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [03.05] 2026-MM-DD — Recálculo de métricas con expenses reales
- ✅ `useTotalBalance` actualizado: ahora resta sum(expenses.amount) del initial_balance por wallet
- ✅ Hook nuevo `useWalletMetrics(walletId)` (en `lib/walletMetrics.ts` o dentro de stores) → devuelve `presupuesto`, `gastado`, `restante`, `usedPct`, `count`
- ✅ Header del Detalle Wallet usa `useWalletMetrics`; ProgressBar y "% usado" reactivos
- ✅ Indicador over-budget cuando `usedPct >= 1` (texto warning en lugar de blanco@70%)
- ✅ ADR-009 marcado como **Resuelto**
- 📁 Tocados: `app/stores/wallets.ts`, `app/lib/walletMetrics.ts`, `app/app/(app)/wallet/[id].tsx`, `bitacora/DECISIONS.md`
- 🧪 Verificación: crear/editar/borrar gasto refleja en Detalle Y Home BalanceCard inmediatamente
```

### Update `STATE.md`
- **Último módulo completado:** 03.05-recalc-metrics
- **Próximo módulo a ejecutar:** prompts/03-fase-gastos/06-validate-vs-mock.md
