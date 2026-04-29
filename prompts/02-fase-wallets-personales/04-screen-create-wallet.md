# 04 — Screen Crear Wallet (personal)

## Objetivo
Form completo para crear una wallet personal con preview en vivo, picker de ícono, color, presupuesto inicial con quick-add chips, y toggles opcionales. Insertar en Supabase y volver al Home actualizando la lista.

**Scope Fase 2:** SOLO `type='personal'`. La sección de Miembros (type='team') se ignora hasta Fase 4 — el toggle Personal/Team se renderiza pero el lado "En equipo" queda deshabilitado con label "Próximamente".

## Pre-requisitos
- Módulos 02.01 (tabs), 02.02 (store), 02.03 (home con navegación al FAB) cerrados

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx` — ground truth
- `prompts/00-MASTER.md` (tokens, microcopy, formato PYG)
- `app/lib/walletIcons.ts` (catálogo de 8 íconos)
- `app/stores/wallets.ts` (`create` action)
- Mock abierto: `WallaTeam Prototype.html` → tab "03 · Crear Wallet"

## Tareas

### 1. Schema zod

Crear `app/schemas/wallet.ts`:

```ts
import { z } from 'zod';

export const newWalletSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(40, 'Máximo 40'),
  type: z.enum(['personal', 'team']),
  icon: z.enum(['piggy','home','plane','briefcase','gift','sparkle','shopping','food','wallet']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  currency_code: z.string().default('PYG'),
  initial_balance: z.number().int().nonnegative('Debe ser >= 0'),
  target_date: z.string().nullable(),
  budget_alert_pct: z.number().int().min(1).max(100).nullable(),
  is_private: z.boolean(),
});

export type NewWalletForm = z.infer<typeof newWalletSchema>;
```

### 2. Pantalla `app/app/(app)/create-wallet.tsx`

Reemplazar el placeholder. Layout en `<ScrollView>` con `<KeyboardAvoidingView>` arriba.

**Estructura top-down:**

#### a. AppBar custom (no usar header de stack)
- Padding 16 horizontal, 12 vertical
- Row: `<Pressable>` icon `ChevronLeft` 24px (← back con `router.back()`) + columna gap 2:
  - "Nueva wallet" 17px semibold
  - "Personal" 12px regular textSecondary (cambia a "En equipo" si type='team')

#### b. Preview header card
- Container con gradient en vivo según `color` seleccionado: `expo-linear-gradient` colors=[color, secondary], borderRadius 20, padding 24, marginHorizontal 16, sombra cardHi, alignItems center, gap 12
- IconBox grande (size 64) con icon seleccionado, fondo blanco translúcido (rgba 255,255,255,0.2)
- Nombre wallet 20px bold blanco (placeholder "Mi wallet" si está vacío)
- Chip "PERSONAL" o "EN EQUIPO" tone="surface" (custom — bg blanco@20%, texto blanco)
- "X miembros" para team / "Solo vos" para personal — 12px medium blanco@85%

#### c. Section "Tipo de wallet"
- Label uppercase "TIPO" arriba
- Row de 2 cards (cada una `flex: 1`, gap 12):
  - **Personal**: icon `User`, label "Personal", subtitle "Solo para vos" — selected ring 2px primary cuando active
  - **En equipo**: icon `Users`, label "En equipo", subtitle "Próximamente Fase 4" — **disabled con opacity 0.5**, no responde a tap
- Card: padding 18, borderRadius 14, border 1px, bg surface, gap 8

#### d. Section "Nombre" 
- Input estilo `WTField` (reusar `<Input>`) con label "NOMBRE" + counter `{value.length}/40` chico a la derecha del label
- Placeholder "Viaje en familia, Hogar, Ahorros..."

#### e. Section "Ícono y color"
- Label "ÍCONO Y COLOR"
- Grid 4 columnas × 2 filas (los 8 íconos del catálogo). Cada celda:
  - Pressable cuadrado size 64, borderRadius 14
  - IconBox del color del ícono (con su color del catálogo)
  - Selected: ring 3px primary + check overlay top-right
- Picker de color custom: 8 swatches circulares (24px) en una row, los hex usados en el mock: `#16A085, #1F3A5F, #3B82F6, #2ECC71, #E74C3C, #F39C12, #9B59B6, #7F8C8D`. Selected con border 2px white inside + outer ring primary.
- Cuando elegís un ícono, su color default sobreescribe el color picker (pero el user puede cambiarlo después).

#### f. Section "Moneda"
- Label "MONEDA"
- Selector tipo button row: por ahora SOLO PYG visible y selected. Otros (USD/ARS/EUR) con label "Próximamente — Fase 7" deshabilitados.
- Tip below: "Tu moneda principal. Podrás cambiarla más adelante."

#### g. Section "Presupuesto inicial"
- Label "PRESUPUESTO INICIAL"
- Big input con prefijo `₲` 22px bold y número 32px bold (estilo del mock add-expense). Use `<TextInput keyboardType="numeric">`.
- **Quick add chips** debajo (Pressable row, gap 8, scrollHorizontal): `+100k`, `+500k`, `+1M`, `+5M`. Cada tap suma al balance actual. Estilo: padding 8 12, borderRadius 999, bg `chipBg` primary, text 12px semibold primary.
- Tip below: "Puede ser tu meta de ahorro o el monto que asignás. Lo podés cambiar después."

#### h. Section "Opciones avanzadas" (collapsible)
- Header `Pressable` con label "Opciones avanzadas" + icon ChevronDown/Up
- Cuando expanded:
  - **Toggle "Fecha objetivo"**: row con icon `Calendar` + label + Switch + (si on) DatePicker (`@react-native-community/datetimepicker` — instalar con `npx expo install`).
  - **Toggle "Aviso de presupuesto"**: icon `Bell` + label + Switch + (si on) input numérico `%` (default 80) con label "Avisarme al X%"
  - **Toggle "Wallet privada"**: icon `Lock` + label + subtitle "No aparece en el resumen general" + Switch

Componente helper `<ToggleRow>` para reusar entre los 3.

#### i. CTA bar (fija en bottom)
- `<View>` con `position: absolute`, bottom 0, left/right 0, padding 16, bg `theme.colors.background`, borderTopWidth 1px borderTop `theme.colors.border`
- Row 2 botones gap 12:
  - **Cancelar** (variant outline, flex 1) → `router.back()`
  - **Crear wallet** (variant primary, flex 2) → `handleSubmit(onSubmit)`

### 3. Wiring del form

```tsx
const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<NewWalletForm>({
  resolver: zodResolver(newWalletSchema),
  defaultValues: {
    name: '',
    type: 'personal',
    icon: 'wallet',
    color: '#16A085',
    currency_code: 'PYG',
    initial_balance: 0,
    target_date: null,
    budget_alert_pct: null,
    is_private: false,
  },
});

const watched = watch();  // Para preview en vivo
```

`watched.color`, `watched.icon`, `watched.name`, `watched.type` alimentan el preview header.

### 4. onSubmit

```tsx
async function onSubmit(values: NewWalletForm) {
  setSubmitting(true);
  try {
    const created = await useWallets.getState().create(values);
    router.replace('/'); // vuelve al Home; como create() actualizó el store, la lista ya tiene la nueva
    // (Opcional UX) Navegar directamente al detalle: router.replace(`/wallet/${created.id}`);
  } catch (err) {
    Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo crear');
  } finally {
    setSubmitting(false);
  }
}
```

### 5. Detalle: instalar DatePicker

```bash
cd app
npx expo install @react-native-community/datetimepicker
```

Uso (Android pop-up, iOS spinner inline):

```tsx
import DateTimePicker from '@react-native-community/datetimepicker';

{showPicker && (
  <DateTimePicker
    value={value ? new Date(value) : new Date()}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    minimumDate={new Date()}
    onChange={(_e, d) => {
      setShowPicker(false);
      if (d) onChange(d.toISOString().slice(0,10));
    }}
  />
)}
```

### 6. Modal-like presentation

En `app/app/(app)/_layout.tsx`, agregar opciones a la screen:

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="(tabs)" />
  <Stack.Screen name="create-wallet" options={{ presentation: 'modal' }} />
  <Stack.Screen name="wallet/[id]" />
</Stack>
```

`presentation: 'modal'` da el slide up animation natural en iOS y un buen comportamiento en Android.

## Validación

- ✅ Tap en FAB → abre Crear Wallet con animación modal
- ✅ Preview header se actualiza en vivo al cambiar nombre, icon, color, type
- ✅ Type "En equipo" deshabilitado
- ✅ Counter del nombre actualiza al tipear
- ✅ Grid de íconos: tap selecciona y aplica color default
- ✅ Color picker: tap cambia el color del preview
- ✅ Quick-add chips suman al presupuesto
- ✅ Toggles avanzados expanden/colapsan
- ✅ DatePicker abre y persiste la fecha
- ✅ Validación zod: nombre <2 chars muestra error inline
- ✅ Tap "Crear wallet" inserta en Supabase y vuelve al Home con la wallet en la lista
- ✅ "Cancelar" cierra sin guardar
- ✅ Loading state en botón Crear durante el insert
- ✅ Error de Supabase (ej. RLS bloqueado) muestra Alert
- ✅ Dark mode: todo legible

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [02.04] 2026-MM-DD — Pantalla Crear Wallet (personal)
- ✅ Schema zod `schemas/wallet.ts` con `newWalletSchema`
- ✅ Pantalla `(app)/create-wallet.tsx` con AppBar, preview header gradient en vivo, type selector (personal activo, team disabled), nombre con counter, grid 8 íconos, color picker 8 swatches, moneda PYG, presupuesto con quick-add chips, opciones avanzadas (target_date con DatePicker, budget_alert_pct, is_private)
- ✅ Componente reutilizable `<ToggleRow>` para opciones avanzadas
- ✅ DatePicker integrado vía `@react-native-community/datetimepicker`
- ✅ `(app)/_layout.tsx`: route `create-wallet` registrada con `presentation: 'modal'`
- ✅ onSubmit llama `useWallets.getState().create()` y vuelve al Home
- 📁 Tocados: `app/schemas/wallet.ts`, `app/app/(app)/create-wallet.tsx`, `app/app/(app)/_layout.tsx`, `app/components/ToggleRow.tsx`, `app/package.json` (datetimepicker)
- 🧪 Verificación: crear wallet → aparece en Home; cancelar → no se inserta; validaciones funcionan
```

### Update `STATE.md`
- **Último módulo completado:** 02.04-screen-create-wallet
- **Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/05-screen-wallet-detail.md
