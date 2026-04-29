# 03 — Pantalla Agregar Gasto

## Objetivo
Pantalla `/expense/new` (con query param opcional `?walletId=...`) para crear un gasto en una wallet personal. Form completo: monto grande con máscara `₲ 1.200.000`, descripción + categoría con picker, selector de wallet, fecha/hora, sección "Cómo dividir" deshabilitada (Fase 5), placeholder de adjuntar ticket. Submit llama `useExpenses.create(...)` y vuelve al Detalle.

## Pre-requisitos
- Módulos 03.01 y 03.02 cerrados

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-add-expense.jsx` — ground truth
- `prompts/00-MASTER.md` (tokens, microcopy)
- `app/lib/categories.ts`, `app/lib/walletIcons.ts`
- `app/stores/expenses.ts`, `app/stores/wallets.ts`
- Pantalla Crear Wallet ya existente como referencia de patrón modal + form

## Tareas

### 1. Schema zod en `app/schemas/expense.ts`

```ts
import { z } from 'zod';

export const newExpenseSchema = z.object({
  wallet_id: z.string().uuid('Wallet inválida'),
  description: z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80'),
  amount: z.number().int().positive('Debe ser mayor a 0'),
  category: z.enum(['food','transport','home','shopping','entertainment','health','work','other']),
  occurred_at: z.string(),  // ISO
  note: z.string().max(280).nullable().optional(),
});

export type NewExpenseForm = z.infer<typeof newExpenseSchema>;
```

### 2. Componente `app/components/AmountInput.tsx`

Reusable: input grande con prefijo `₲` + máscara de miles `1.200.000`. Lo necesitamos también para Crear Wallet (refactor opcional) y para Agregar Gasto.

```tsx
import { View, Text, TextInput } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface Props {
  value: number;
  onChange: (n: number) => void;
  symbolSize?: number;  // 22 default
  numberSize?: number;  // 36 default
  placeholder?: string;
  autoFocus?: boolean;
}

export function AmountInput({
  value, onChange,
  symbolSize = 22, numberSize = 36,
  placeholder = '0', autoFocus,
}: Props) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.semibold,
          fontSize: symbolSize,
          color: theme.colors.textSecondary,
        }}
      >
        ₲
      </Text>
      <TextInput
        autoFocus={autoFocus}
        style={{
          flex: 1,
          fontFamily: typography.fontFamily.bold,
          fontSize: numberSize,
          color: theme.colors.textPrimary,
          padding: 0,
          letterSpacing: -1,
        }}
        keyboardType="numeric"
        value={value === 0 ? '' : value.toLocaleString('es-PY')}
        onChangeText={(t) => {
          const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
          onChange(isNaN(n) ? 0 : n);
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  );
}
```

### 3. Componente `app/components/FormRow.tsx`

Fila tappable con icon redondito + label uppercase + value + chip opcional + chevron-right (o trailing custom). Match con el `FormRow` del mock (líneas 106-129 de `screen-add-expense.jsx`).

Props:

```tsx
interface FormRowProps {
  iconName: IconName;
  label: string;
  value: string;
  subValue?: string;
  chip?: { text: string; tone: 'primary' | 'secondary' };
  trailing?: ReactNode;  // por default: ChevronRight
  onPress?: () => void;
  error?: string;
}
```

Estructura:
- Container row, gap 12, padding 12 14, borderRadius 14, bg surface, border 1px
- Icon circle (size 36, borderRadius 10, bg `theme.colors.background`, icon primary 16px)
- Centro flex 1: label uppercase 10px sb 0.4 letterSpacing + (value 13px sb + chip + "· subValue")
- Trailing: por default ChevronRight 18 textSecondary, o el `trailing` custom (ej. Avatar)
- Si `error` → mostrar texto debajo en danger 11px

### 4. Componente `app/components/CategoryPicker.tsx` (BottomSheet o modal)

Picker que se abre desde el FormRow "Descripción + categoría" (o un FormRow separado de "Categoría"). Diseño: grid 4 columnas con cada categoría como card cuadrado (icon + label).

Implementación simple sin libs externas: un `<Modal>` de RN con backdrop + content sheet abajo.

```tsx
import { Modal, View, Text, Pressable, FlatList } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { CATEGORIES, CategoryDef, CategoryId } from '@/lib/categories';
import { IconBox } from './IconBox';

interface Props {
  visible: boolean;
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  onClose: () => void;
}

export function CategoryPicker({ visible, selected, onSelect, onClose }: Props) {
  const { theme } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
      />
      <View
        style={{
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          paddingBottom: 32,
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            color: theme.colors.textPrimary,
            marginBottom: 16,
          }}
        >
          Elegir categoría
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  onSelect(cat.id);
                  onClose();
                }}
                style={{
                  width: '22%',
                  alignItems: 'center',
                  gap: 8,
                  padding: 12,
                  borderRadius: 14,
                  borderWidth: isSelected ? 2.5 : 1,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                }}
              >
                <IconBox iconName={cat.icon} color={cat.color} size={36} />
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 11,
                    color: theme.colors.textPrimary,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
```

### 5. Componente `app/components/WalletPickerSheet.tsx`

Igual que CategoryPicker pero con la lista de wallets disponibles del user. Usa el formato de `WalletRow` reducido (icon + nombre + balance compacto).

```tsx
interface Props {
  visible: boolean;
  selected: string | null;
  onSelect: (walletId: string) => void;
  onClose: () => void;
}
```

Lista filtrada: solo `wallets.filter(w => w.type === 'personal' && !w.archived_at)`.

### 6. Pantalla `app/app/(app)/expense/new.tsx`

Estructura top-down:

#### a. AppBar custom
- Pressable back con icon `ArrowLeft` (en círculo 36×36 surface con border) + columna:
  - "Nuevo gasto" 16px bold textPrimary letterSpacing -0.2
  - "Registrá un movimiento" 11px regular textSecondary

#### b. Card de monto
- Container surface + border 1px, borderRadius 18, padding 18, marginTop 6
- Label "MONTO" 11px sb 0.3 textSecondary
- `<AmountInput />` autoFocus
- Chip debajo: bg `chipBg` primary, padding `4px 10px`, borderRadius 8, gap 6, icon `Tag` 12px primary + "Guaraníes (PYG)" 11px sb primary

#### c. FormRow Descripción + Categoría

Una sola fila combinada (siguiendo el mock) o dos separadas. Recomiendo dos:

- **Descripción**: FormRow con icon `Tag`, label "DESCRIPCIÓN", value `<TextInput inline>` con placeholder "Cena restaurant", maxLength 80
- **Categoría**: FormRow con icon resuelto de la categoría seleccionada (default `Tag`), label "CATEGORÍA", value `cat.label` ("Comida"), tap → abre `CategoryPicker`. Trailing `ChevronRight`.

(Si querés el patrón "Descripción + subValue=Categoría" del mock, hacelo con un solo FormRow donde tap abre el picker — pero la edición del texto se hace con un TextInput inline. Más simple separarlos.)

#### d. FormRow Wallet
- Icon `Wallet`, label "WALLET", value `selectedWallet.name`, chip "PERSONAL" tone primary
- Tap → abre `WalletPickerSheet` (solo si vino sin `walletId` en query, sino fijo)

#### e. FormRow Fecha
- Icon `Calendar`, label "FECHA", value `formatExpenseDate(occurred_at)` (mostrar "Hoy · 17 mar 2026" o similar), subValue hora (`HH:mm`)
- Tap → abre DateTimePicker (modo `datetime` si Android lo soporta, sino mode `date` y mode `time` en dos pasos)
- Default: `new Date()`

#### f. FormRow Pagado por
- Icon `User`, label "PAGADO POR", value nombre del user actual (de `useAuth`), trailing `<Avatar name={fullName} size={26} />`
- En Fase 3 NO es editable (no hay miembros). Solo muestra info.

#### g. Sección "Cómo dividir" (deshabilitada)
- Card surface + border, padding 16, borderRadius 18
- Header: title "Cómo dividir" 13px bold + subtitle "Multi-split disponible en Fase 5" 11px textSecondary
- Segmented control `=` `%` `₲` rendereado pero con `disabled opacity 0.4`. El `=` aparece como activo.
- Una sola SplitRow placeholder con el user actual: avatar + "Vos" + barra al 100% + "100%" + monto formateado
- Footer: "Total asignado: 100% · {fmtGs(amount)}" en accent green

#### h. Sección "Adjuntar ticket"
- Row con dashed border (`borderStyle: 'dashed'`):
  - Card flex 1 con icon `Camera` + texto "Adjuntar ticket" 12px textSecondary
  - Card 50×50 con icon `Plus`
- Tap a cualquiera → `Alert("Próximamente — Fase 8")`

#### i. CTA bar fija al fondo
- View posición absoluta, paddingTop 10 paddingHorizontal 18 paddingBottom 14 (con safe area), borderTopWidth 1
- Row 2 botones gap 10:
  - **Cancelar** (variant outline, flex 1) → `router.back()`
  - **Guardar gasto** (variant primary con `iconLeft="Check"`, flex 2) → `handleSubmit(onSubmit)`

### 7. Wiring del form

```tsx
const params = useLocalSearchParams<{ walletId?: string }>();
const wallets = useWallets((s) => s.wallets.filter(w => w.type === 'personal' && !w.archived_at));
const initialWalletId = params.walletId ?? wallets[0]?.id ?? '';

const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<NewExpenseForm>({
  resolver: zodResolver(newExpenseSchema),
  defaultValues: {
    wallet_id: initialWalletId,
    description: '',
    amount: 0,
    category: 'food',
    occurred_at: new Date().toISOString(),
    note: null,
  },
});
```

`watched.wallet_id`, `watched.category` resuelven a defs para mostrar nombre/icono.

### 8. onSubmit

```tsx
async function onSubmit(values: NewExpenseForm) {
  setSubmitting(true);
  try {
    await useExpenses.getState().create({
      wallet_id: values.wallet_id,
      description: values.description.trim(),
      amount: values.amount,
      category: values.category,
      occurred_at: values.occurred_at,
      note: values.note ?? null,
    });
    router.back();   // vuelve al Detalle si vino de ahí, o al Home
  } catch (err) {
    Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar');
  } finally {
    setSubmitting(false);
  }
}
```

### 9. Registrar la ruta como modal

En `app/app/(app)/_layout.tsx` agregar:

```tsx
<Stack.Screen name="expense/new" options={{ presentation: 'modal' }} />
```

(La carpeta `app/app/(app)/expense/` también hay que crearla.)

### 10. Wirear los entry points

- **FAB del Detalle**: ya wireado en módulo 03.02
- **EmptyExpenses → botón "Agregar gasto"**: ya wireado en 03.02
- **Quick action "Gasto" del Home**: actualizar para que abra `WalletPickerSheet` si hay >1 wallet, sino navegar directo. Si 0 wallets → `Alert("Primero creá una wallet")`.

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ Tap en FAB del Detalle → abre Agregar Gasto con `walletId` precargado, AppBar visible, monto autofocus
- ✅ Tipear `120000` muestra `120.000` con máscara
- ✅ Chip "Guaraníes (PYG)" debajo del monto
- ✅ Tap en categoría abre el picker, selección lo cambia
- ✅ Tap en fecha abre DateTimePicker
- ✅ Sección "Cómo dividir" se ve pero está disabled con label "Fase 5"
- ✅ "Adjuntar ticket" abre Alert
- ✅ Tap "Guardar gasto" inserta en Supabase (vía RPC) y vuelve al Detalle
- ✅ El gasto recién creado aparece en la lista del Detalle inmediatamente
- ✅ Validación zod: monto 0 → error "Debe ser mayor a 0"; descripción <2 → error
- ✅ Loading state en botón Guardar
- ✅ "Cancelar" vuelve sin guardar
- ✅ Si entrás sin `?walletId=` y tenés 1 wallet → preselecciona; si tenés varias → muestra el sheet
- ✅ Dark mode

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [03.03] 2026-MM-DD — Pantalla Agregar Gasto
- ✅ Schema zod `schemas/expense.ts` (`newExpenseSchema`)
- ✅ Componente `AmountInput` reusable (₲ + máscara `1.200.000`)
- ✅ Componente `FormRow` reusable (icon circle + label uppercase + value + chip + trailing chevron)
- ✅ Componente `CategoryPicker` (modal sheet, grid 4×2 de las 8 categorías)
- ✅ Componente `WalletPickerSheet` (modal sheet con lista de wallets personales)
- ✅ Pantalla `(app)/expense/new.tsx`: AppBar back+title, card monto con chip Guaraníes, FormRows (Descripción, Categoría, Wallet, Fecha, Pagado por), sección "Cómo dividir" disabled con label "Fase 5", placeholder adjuntar ticket, CTA bar (Cancelar + Guardar gasto)
- ✅ Soporte query param `?walletId=...`; si no vino y hay 1 wallet → preselecciona; si hay varias → abre WalletPickerSheet
- ✅ Submit llama `useExpenses.create()` y vuelve al Detalle
- ✅ Route registrada como modal en `(app)/_layout.tsx`
- ✅ Quick action "Gasto" del Home wireado
- 📁 Tocados: `app/schemas/expense.ts`, `app/components/{AmountInput,FormRow,CategoryPicker,WalletPickerSheet}.tsx`, `app/app/(app)/expense/new.tsx`, `app/app/(app)/_layout.tsx`, `app/app/(app)/(tabs)/home.tsx`
- 🧪 Verificación: crear un gasto desde Detalle → vuelve a Detalle con el expense en la lista
```

### Update `STATE.md`
- **Último módulo completado:** 03.03-screen-add-expense
- **Próximo módulo a ejecutar:** prompts/03-fase-gastos/04-edit-delete-expense.md
