# 08.06 — Tab Resumen en wallet personal con charts

## Objetivo
Reemplazar el placeholder "Próximamente — Fase 8" del tab Resumen del Wallet Detail (cuando `wallet.type === 'personal'`) por la pantalla real con monto del mes destacado, `MonthlyBarChart` (últimos 6 meses) y `CategoryDonut` del mes seleccionado.

## Pre-requisitos
- 08.05 completado (charts disponibles).
- Hooks `useMonthlyTotals` / `useCategoryTotals` operativos.
- Al menos algunos gastos cargados en una wallet personal para validación.

## Contexto necesario
- `app/app/(app)/wallet/[id].tsx` — actualmente el `ResumenTab` tiene un early-return con el placeholder para `wallet.type === 'personal'` (ver módulo 06.03).
- `app/components/{MonthlyBarChart,CategoryDonut}.tsx` — del 08.05.
- `app/lib/stats.ts` — hooks.

## Tareas

### 1. Refactor del `ResumenTab` para personal
Reemplazar el bloque actual:
```tsx
if (wallet.type === 'personal') {
  return (
    <ScrollView ...>
      <Text>Próximamente — Fase 8</Text>
      <Text>Vas a poder ver gráficos y resumen mensual de tus gastos.</Text>
    </ScrollView>
  );
}
```

Por una nueva subpantalla `PersonalResumenTab` (función en el mismo archivo o componente extraído si crece). Estructura:

```tsx
function PersonalResumenTab({ wallet }: { wallet: Wallet }) {
  const now = new Date();
  const [selected, setSelected] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1, // 1-12
  });

  const monthly = useMonthlyTotals(wallet.id, 6);
  const category = useCategoryTotals(wallet.id, selected.year, selected.month);

  const selectedYyyymm = `${selected.year}-${String(selected.month).padStart(2,'0')}`;
  const selectedMonthData = monthly.find(m => m.yyyymm === selectedYyyymm);
  const totalDelMes = selectedMonthData?.spent ?? 0;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 28 }}>
      {/* 1. Header — total del mes seleccionado */}
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text style={uppercase11}>GASTO DEL MES</Text>
        <Text style={hero22Bold}>{fmtGs(totalDelMes)}</Text>
        <Text style={textSecondary12}>{monthYearLabel(selected)}</Text>
      </View>

      {/* 2. MonthlyBarChart */}
      <View>
        <Text style={uppercase11}>ÚLTIMOS 6 MESES</Text>
        <MonthlyBarChart
          data={monthly}
          selectedYyyymm={selectedYyyymm}
          onSelectMonth={(yyyymm) => {
            const [y, m] = yyyymm.split('-').map(Number);
            setSelected({ year: y, month: m });
          }}
        />
      </View>

      {/* 3. CategoryDonut */}
      <View>
        <Text style={uppercase11}>POR CATEGORÍA</Text>
        <CategoryDonut data={category} />
      </View>
    </ScrollView>
  );
}
```

Reusar los mismos tokens y estilos de label uppercase 11px que ya usa el tab Resumen team (consistencia con 06.03).

### 2. Helper `monthYearLabel({year, month})`
Devuelve un string como `"Mayo 2026"` (capitalize). Usar `Intl.DateTimeFormat('es-PY', { month: 'long', year: 'numeric' })` y capitalizar primera letra. Definirlo inline o en `app/lib/format.ts` si encaja con `fmtGs`.

### 3. Edge cases
- Wallet personal sin gastos todavía: el hook devuelve 6 meses en 0 + categoría vacía. La UI debe mostrar:
  - Header: "GASTO DEL MES" + "₲ 0".
  - `MonthlyBarChart`: empty state "Sin gastos en los últimos 6 meses" (ya implementado en 08.05).
  - `CategoryDonut`: empty state "Sin gastos este mes" (ya implementado).
- Wallet con sólo ingresos (kind='income'): mismos empty states. Los charts ignoran income (por decisión del 08.04).

### 4. Sin cambios en team
Verificar que el tab Resumen para `wallet.type === 'team'` sigue intacto (el balance del grupo del 06.03). El `if (wallet.type === 'personal')` sigue como gate del nuevo subcomponente; debajo viene el código actual del balance team.

## Validación
- `npm run typecheck` limpio.
- En Expo Go:
  - Abrir una wallet personal con varios gastos repartidos en meses → ver header con monto del mes, bar chart con barras proporcionales, donut con categorías.
  - Tap en una barra de un mes pasado → el donut se actualiza y el header refleja el mes seleccionado.
  - Wallet personal recién creada (sin gastos): ver empty states de ambos charts y header en 0.
  - Wallet team: el tab Resumen sigue mostrando el balance del grupo (no charts).

## Bitácora
- Entry `[08.06]` en CHANGELOG. Tocados: `app/app/(app)/wallet/[id].tsx`, posiblemente `app/lib/format.ts`.
- Commit `feat(extras)[08.06]: tab Resumen personal con charts mensuales y por categoría`.
