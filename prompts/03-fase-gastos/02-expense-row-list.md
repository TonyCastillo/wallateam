# 02 — ExpenseRow component + lista en Detalle Wallet

## Objetivo
Crear el componente `ExpenseRow` y reemplazar `<EmptyExpenses />` en el tab Gastos del Detalle Wallet por una `<FlatList>` real con los expenses del store. Mantener `EmptyExpenses` para cuando la lista esté vacía.

## Pre-requisitos
- Módulo 03.01 cerrado (store con datos)

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx` — ver sección de lista de gastos
- `app/lib/categories.ts` (categoría → icon + color)
- `app/lib/format.ts` (`fmtGs`)
- `app/stores/expenses.ts` (`useExpenses`)
- `app/components/Avatar.tsx` (creado en Fase 2 — para el avatar del payer)

## Tareas

### 1. Helper `formatExpenseDate`

Crear o agregar en `app/lib/format.ts`:

```ts
export function formatExpenseDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (sameDay) {
    return `Hoy · ${d.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (isYesterday) {
    return `Ayer · ${d.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString('es-PY', { day: 'numeric', month: 'short', year: 'numeric' });
}
```

### 2. Crear `app/components/ExpenseRow.tsx`

Layout:
- Container: row, gap 12, padding 14, bg surface, borderRadius 14, sombra `card`
- Izq: `<IconBox>` con icono+color de la categoría (size 40, bgOpacity 0.15)
- Centro (flex 1):
  - Row 1: descripción 15px semibold textPrimary (truncate 1 línea)
  - Row 2: "Pagó {nombre} · {fecha}" 12px regular textSecondary, truncate 1 línea
- Derecha (alineado a la derecha):
  - Monto: 15px semibold textPrimary con prefijo `−` (minus signo Unicode) en color textPrimary (en Fase 3 todos los gastos son neg desde la perspectiva de la wallet)
  - Subtítulo opcional 11px regular textSecondary: "Equitativo" o el split_mode

Props:

```tsx
interface ExpenseRowProps {
  expense: Expense;
  payerName?: string;  // si no se provee, mostrar "Vos" si paid_by === currentUserId
  onPress?: () => void;
  onLongPress?: () => void;  // para edit/delete (Fase 3.04)
}
```

Implementación:

```tsx
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { categoryById } from '@/lib/categories';
import { fmtGs, formatExpenseDate } from '@/lib/format';
import { IconBox } from './IconBox';
import { useAuth } from '@/stores/auth';
import { Expense } from '@/lib/types';

export function ExpenseRow({ expense, payerName, onPress, onLongPress }: Props) {
  const { theme } = useTheme();
  const cat = categoryById(expense.category);
  const currentUserId = useAuth((s) => s.user?.id);
  const payerLabel = payerName ?? (expense.paid_by === currentUserId ? 'Vos' : 'Otro');

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={[styles.row, { backgroundColor: theme.colors.surface }, theme.shadows.card]}
    >
      <IconBox iconName={cat.icon} color={cat.color} size={40} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontFamily: typography.fontFamily.semibold,
          }}
          numberOfLines={1}
        >
          {expense.description}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 12,
            fontFamily: typography.fontFamily.regular,
          }}
          numberOfLines={1}
        >
          Pagó {payerLabel} · {formatExpenseDate(expense.occurred_at)}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontFamily: typography.fontFamily.semibold,
          }}
        >
          {`− ${fmtGs(expense.amount)}`}
        </Text>
        {/* Fase 3 omitir chip de split mode (es siempre 'equal' single user). Fase 5 lo mostrará. */}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
  },
});
```

### 3. Reemplazar `<EmptyExpenses />` en `app/(app)/wallet/[id].tsx`

En el render del tab Gastos:

```tsx
{tab === 'gastos' && <ExpensesList walletId={wallet.id} />}
```

Crear `ExpensesList` inline o como subcomponente:

```tsx
function ExpensesList({ walletId }: { walletId: string }) {
  const { theme } = useTheme();
  const router = useRouter();
  const list = useExpenses((s) => s.list(walletId));
  const loading = useExpenses((s) => s.loading);
  const fetchByWallet = useExpenses((s) => s.fetchByWallet);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (list.length === 0) fetchByWallet(walletId);
  }, [walletId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchByWallet(walletId);
    setRefreshing(false);
  };

  if (loading && list.length === 0) {
    // Skeleton 3 rows
    return (
      <View style={{ padding: 16, gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              height: 68,
              borderRadius: 14,
              backgroundColor: theme.colors.surfaceAlt,
              opacity: 0.5,
            }}
          />
        ))}
      </View>
    );
  }

  if (list.length === 0) return <EmptyExpenses walletId={walletId} />;

  return (
    <FlatList
      data={list}
      keyExtractor={(e) => e.id}
      contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 96 }}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
      renderItem={({ item }) => (
        <ExpenseRow
          expense={item}
          onPress={() => router.push(`/expense/${item.id}/edit`)}
          // onLongPress se agrega en módulo 03.04
        />
      )}
    />
  );
}
```

### 4. Actualizar `EmptyExpenses` para recibir `walletId`

`EmptyExpenses` en Fase 2 tenía un Alert hardcodeado en el botón "Agregar gasto". Ahora navega a la pantalla real:

```tsx
import { useRouter } from 'expo-router';

interface Props {
  walletId?: string;
}

export function EmptyExpenses({ walletId }: Props) {
  const router = useRouter();
  // ...
  <Button
    variant="outline"
    label="Agregar gasto"
    iconLeft="Plus"
    onPress={() =>
      router.push(walletId ? `/expense/new?walletId=${walletId}` : '/expense/new')
    }
  />
  // ...
}
```

(La pantalla `/expense/new` se crea en módulo 03.03 — por ahora puede no existir y el push tira un warning soft, no rompe.)

### 5. FAB del Detalle Wallet también navega

En `wallet/[id].tsx`, el FAB que actualmente hace `Alert("Próximamente")`:

```tsx
<Pressable
  onPress={() => router.push(`/expense/new?walletId=${wallet.id}`)}
  style={[styles.fab, ...]}
>
  <Icon name="Plus" size={26} color="#fff" strokeWidth={2.4} />
</Pressable>
```

### 6. Quick action "Gasto" del Home (opcional en este módulo)

Idem en Home, el quick action "Gasto" puede:
- Si solo hay 1 wallet → push directo con `?walletId=...`
- Si hay múltiples → mostrar un sheet de selección de wallet (componente `WalletPickerSheet` se hace en 03.03)
- Por ahora dejar `Alert("Próximamente")` y mover el wiring a 03.03

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ En Detalle Wallet con expenses dummy de 03.01 → ExpenseRow visibles
- ✅ Si la wallet no tiene expenses → EmptyExpenses
- ✅ Pull-to-refresh recarga
- ✅ Tap a un expense → push (puede ir a 404 hasta 03.03, pero el botón funciona)
- ✅ FAB navega también
- ✅ Dark mode legible

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [03.02] 2026-MM-DD — ExpenseRow + lista en Detalle
- ✅ `components/ExpenseRow.tsx`: row con IconBox de categoría + descripción + "Pagó X · fecha" + monto con `−` Unicode
- ✅ Helper `formatExpenseDate(iso)` en `lib/format.ts` (Hoy / Ayer / fecha completa)
- ✅ `wallet/[id].tsx` reemplaza `<EmptyExpenses />` por `<ExpensesList />` con FlatList + RefreshControl + skeleton
- ✅ `EmptyExpenses` ahora navega a `/expense/new?walletId=...` (la pantalla se crea en 03.03)
- ✅ FAB del Detalle wirea a `/expense/new?walletId=...`
- 📁 Tocados: `app/components/ExpenseRow.tsx`, `app/components/EmptyExpenses.tsx`, `app/lib/format.ts`, `app/app/(app)/wallet/[id].tsx`
- 🧪 Verificación: lista visible con expenses dummy; pull-to-refresh OK; empty state OK
```

### Update `STATE.md`
- **Último módulo completado:** 03.02-expense-row-list
- **Próximo módulo a ejecutar:** prompts/03-fase-gastos/03-screen-add-expense.md
