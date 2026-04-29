# 04 — Editar y eliminar gastos

## Objetivo
Habilitar edición y borrado de gastos existentes. Edit reusa la pantalla Agregar Gasto en modo "edit" precargando valores; delete se dispara con long-press → confirmación → DELETE. Mantener experiencia consistente entre ambas acciones.

## Pre-requisitos
- Módulos 03.01..03.03 cerrados

## Contexto necesario
- `app/app/(app)/expense/new.tsx` (la convertimos en compartida)
- `app/stores/expenses.ts` (`update`, `remove`)
- `app/components/ExpenseRow.tsx` (agregar onLongPress)

## Tareas

### 1. Refactorizar pantalla a `expense/[mode].tsx` o segundo archivo `[id]/edit.tsx`

Dos opciones de rutas:

**Opción A** (recomendada — DRY): convertir `new.tsx` en una pantalla genérica que detecta modo según query param `?expenseId=...`. Si viene → modo edit (precarga); si no → modo new.

```
app/(app)/expense/new.tsx   ← ruta única, soporta ?expenseId=...
```

**Opción B** (más explícita): duplicar como `[id]/edit.tsx`. Más código pero rutas tipadas claras.

Elegir A. Reescribir el header de `new.tsx`:

```tsx
const params = useLocalSearchParams<{ walletId?: string; expenseId?: string }>();
const isEdit = !!params.expenseId;

const existing = useExpenses((s) =>
  params.expenseId ? Object.values(s.byWallet).flat().find(e => e.id === params.expenseId) : undefined
);

// useEffect que si isEdit && !existing → fetchByWallet (en realidad ya está cargado, pero por seguridad)
// si isEdit y existing está disponible → reset() del form con los valores

const { control, handleSubmit, reset, ...rest } = useForm<NewExpenseForm>({
  resolver: zodResolver(newExpenseSchema),
  defaultValues: existing ? {
    wallet_id: existing.wallet_id,
    description: existing.description,
    amount: Number(existing.amount),
    category: (existing.category ?? 'other') as CategoryId,
    occurred_at: existing.occurred_at,
    note: existing.note,
  } : {
    wallet_id: params.walletId ?? wallets[0]?.id ?? '',
    description: '',
    amount: 0,
    category: 'food',
    occurred_at: new Date().toISOString(),
    note: null,
  },
});

useEffect(() => {
  if (existing) {
    reset({
      wallet_id: existing.wallet_id,
      description: existing.description,
      amount: Number(existing.amount),
      category: (existing.category ?? 'other') as CategoryId,
      occurred_at: existing.occurred_at,
      note: existing.note,
    });
  }
}, [existing?.id]);
```

### 2. Actualizar texts según modo

- AppBar título: "Nuevo gasto" / "Editar gasto"
- AppBar subtitle: "Registrá un movimiento" / "Modificá los datos"
- CTA primary: "Guardar gasto" / "Guardar cambios"

### 3. onSubmit bifurcado

```tsx
async function onSubmit(values: NewExpenseForm) {
  setSubmitting(true);
  try {
    if (isEdit && params.expenseId) {
      await useExpenses.getState().update(params.expenseId, {
        description: values.description.trim(),
        amount: values.amount,
        category: values.category,
        occurred_at: values.occurred_at,
        note: values.note ?? null,
      });
    } else {
      await useExpenses.getState().create({ ...values });
    }
    router.back();
  } catch (err) {
    Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar');
  } finally {
    setSubmitting(false);
  }
}
```

**Nota**: en edit NO permitimos cambiar `wallet_id` (mover gasto entre wallets). Si el user lo cambia en el form, mostrar warning o simplemente ignorar y mantener original. Recomiendo deshabilitar el FormRow de wallet en modo edit con tono "Para mover de wallet, eliminá y creá nuevo".

### 4. Botón "Eliminar" en modo edit

Solo visible si `isEdit`. Dentro de la sección "Opciones avanzadas" o como un botón al fondo del scroll, antes del CTA bar:

```tsx
{isEdit && (
  <Pressable
    onPress={handleDelete}
    style={{
      marginTop: 24,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.danger,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    }}
  >
    <Icon name="Trash2" size={18} color={theme.colors.danger} />
    <Text style={{ color: theme.colors.danger, fontFamily: typography.fontFamily.semibold, fontSize: 15 }}>
      Eliminar gasto
    </Text>
  </Pressable>
)}
```

Handler:

```tsx
function handleDelete() {
  if (!params.expenseId) return;
  Alert.alert(
    'Eliminar gasto',
    `¿Seguro que querés eliminar "${existing?.description}"? Esta acción no se puede deshacer.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await useExpenses.getState().remove(params.expenseId!);
            router.back();
          } catch (err) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ],
  );
}
```

### 5. ExpenseRow: long-press → menú rápido

En el componente `ExpenseRow`, el `onLongPress` ya está como prop (módulo 03.02). Implementarlo desde `ExpensesList` en el Detalle Wallet:

```tsx
const handleLongPress = (expense: Expense) => {
  Alert.alert(
    expense.description,
    fmtGs(expense.amount),
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Editar', onPress: () => router.push(`/expense/new?expenseId=${expense.id}`) },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Eliminar gasto',
            '¿Seguro?',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                  await useExpenses.getState().remove(expense.id);
                },
              },
            ],
          );
        },
      },
    ],
  );
};

// En el FlatList:
<ExpenseRow
  expense={item}
  onPress={() => router.push(`/expense/new?expenseId=${item.id}`)}
  onLongPress={() => handleLongPress(item)}
/>
```

### 6. (Opcional) Swipe-to-delete

Si el tiempo lo permite, instalar `react-native-gesture-handler` (probablemente ya viene con expo-router) y usar `<Swipeable>`. Si no, omitir — long-press es suficiente para Fase 3.

Si lo hacés, documentar en DECISIONS.md como ADR.

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ Tap en un ExpenseRow → abre Editar gasto con datos precargados
- ✅ Title del AppBar dice "Editar gasto"
- ✅ CTA dice "Guardar cambios"
- ✅ Cambiar amount/descripción/categoría/fecha + Guardar → row actualizada en lista
- ✅ Cambiar amount también actualiza el split en DB (verificable desde dashboard)
- ✅ Wallet field aparece como no editable o con warning
- ✅ Botón "Eliminar gasto" rojo visible solo en modo edit
- ✅ Eliminar pide confirmación → borra → vuelve al Detalle, row desaparece
- ✅ Long-press en ExpenseRow → menú rápido con Editar/Eliminar
- ✅ Eliminar via long-press actualiza la lista sin volver a navegar
- ✅ Si el expense fue borrado por otro device (realtime), la lista se sincroniza

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [03.04] 2026-MM-DD — Editar y eliminar gastos
- ✅ Pantalla `expense/new.tsx` ahora soporta query param `?expenseId=...` para modo edit
- ✅ AppBar y CTA cambian text según modo (Nuevo gasto/Editar gasto, Guardar/Guardar cambios)
- ✅ Form precarga valores con `reset()` cuando el expense está en cache
- ✅ Wallet field bloqueado en modo edit (no se permite mover entre wallets)
- ✅ Botón "Eliminar gasto" (rojo, outline) solo visible en edit, con Alert de confirmación
- ✅ ExpenseRow long-press → ActionSheet (via Alert) con Editar/Eliminar
- ✅ Eliminar dispara `useExpenses.remove()` y la lista se actualiza optimísticamente
- 📁 Tocados: `app/app/(app)/expense/new.tsx`, `app/components/ExpenseRow.tsx`, `app/app/(app)/wallet/[id].tsx`
- 🧪 Verificación: edit + delete funcionan E2E; cambio de amount sincroniza el split en DB
```

### Update `STATE.md`
- **Último módulo completado:** 03.04-edit-delete-expense
- **Próximo módulo a ejecutar:** prompts/03-fase-gastos/05-recalc-metrics.md
