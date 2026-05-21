# 08.02 — PhotoPicker en el form de gasto

## Objetivo
Permitir que el usuario adjunte (o reemplace) una foto de ticket en `expense/new.tsx`, tanto al crear como al editar. La foto se sube a Supabase Storage después de que el insert/update del expense haya devuelto el `id`, y se persiste el path en `expenses.photo_url`.

## Pre-requisitos
- 08.01 completado (bucket creado, helper disponible, `expo-image-picker` instalado).
- `app/supabase/storage_setup.sql` aplicado en el dashboard.

## Contexto necesario
- `app/app/(app)/expense/new.tsx` — form actual (create + edit).
- `app/lib/storage.ts` — helpers de upload/signed URL.
- `app/stores/expenses.ts` — método `create` y `update` (firmar el nuevo campo `photo_url`).
- `app/schemas/expense.ts` — schema zod.

## Tareas

### 1. Schema
En `app/schemas/expense.ts`, agregar `photo_url: z.string().nullable().optional()`. (Si ya existía, asegurarse de que sea opcional — la mayoría de los gastos no tendrán foto.)

### 2. Store
En `app/stores/expenses.ts`:
- `create(input)` ya no toca foto (el upload pasa después, ver paso 4).
- Agregar un método `setPhoto(expenseId, path | null)` que hace `update({ photo_url: path }).eq('id', expenseId)` y actualiza el cache local.
- `delete(expenseId)` debe también limpiar la foto del Storage si existe: leer `photo_url` antes de borrar, y si no es null, `deleteExpensePhoto(path)` (best-effort, log y seguir si falla).

### 3. Componente `PhotoPicker` (nuevo)
`app/components/PhotoPicker.tsx`:

```ts
import * as ImagePicker from 'expo-image-picker';
import { Image, View, Pressable, Text, ActionSheetIOS, Platform } from 'react-native';
// ... usar useTheme, Icon, fmtGs, etc.

interface Props {
  /** localUri (file://...) o signedUrl si la foto ya está subida */
  uri: string | null;
  onChange: (localUri: string | null) => void;
  disabled?: boolean;
}

export function PhotoPicker({ uri, onChange, disabled }: Props);
```

UX:
- Si no hay foto: card 80×80 con borde dashed, icono `Camera` y label "Foto del ticket" (opcional).
- Si hay foto: thumbnail 80×80 con badge X arriba a la derecha para quitar (llama `onChange(null)`).
- Tap sobre la card abre un sheet con 3 opciones: "Sacar foto" (camera), "Elegir de galería" (mediaLibrary), "Cancelar". En iOS usar `ActionSheetIOS`; en Android una pequeña `Modal` o un BottomSheet reusando el patrón de `TransactionTypeSheet`.
- Picker config: `mediaTypes: ['images']`, `quality: 0.7`, `allowsEditing: false`.
- Solicitar permisos antes (`requestCameraPermissionsAsync` / `requestMediaLibraryPermissionsAsync`) y mostrar `Alert.alert('Permiso denegado', 'Activá los permisos desde Ajustes para adjuntar fotos.')` si el usuario los rechaza.

### 4. Integración en `expense/new.tsx`

- Agregar estado local `const [localPhoto, setLocalPhoto] = useState<string | null>(null)` (el local URI, no subido aún).
- Si es edit y `existing.photo_url`, al montar: pedir signed URL y guardarlo en `displayPhoto` (solo para preview — al editar, si el usuario no la toca, no resubimos).
- Render del `PhotoPicker` después del `CategoryPicker` y antes del comentario "Cómo dividir". Sección con label "Foto del ticket" en uppercase 11px (igual estilo que las otras secciones).
- En `onSubmit`:
  1. `await create(...)` (o `update`) → obtener `expenseId`.
  2. Si `localPhoto !== null` y es un `file://` (path local, no signedUrl) → `await uploadExpensePhoto({ localUri: localPhoto, userId, expenseId })` → `await setPhoto(expenseId, path)`.
  3. Si el form tenía foto previa y el usuario tocó X (`localPhoto === null && existing?.photo_url`) → `await deleteExpensePhoto(existing.photo_url)` + `await setPhoto(expenseId, null)`.
  4. Si falla el upload pero el expense ya se creó: mostrar `Alert.alert('Foto', 'El gasto se guardó pero la foto no pudo subirse. Probá editarlo después.')`. No rollback.

### 5. Microcopy
- Card placeholder: "Foto del ticket"
- Subtítulo: "Opcional"
- Sheet de elección: "Sacar foto" / "Elegir de galería" / "Cancelar"
- Botón quitar: ícono X (sin texto, con `accessibilityLabel="Quitar foto"`)
- Alert permiso denegado: "Activá los permisos desde Ajustes para adjuntar fotos."

## Validación
- `npm run typecheck` limpio.
- En Expo Go (o build dev) — crear un gasto con foto: el insert pasa, la foto sube, al volver al detalle se ve el preview (que el detalle se muestre completo es 08.03).
- Editar un gasto con foto y reemplazarla: la nueva pisa la anterior (upload nuevo + update path; opcional: borrar la vieja).
- Eliminar un gasto con foto: el archivo de Storage se borra (verificar en Dashboard).

## Bitácora
- Entry `[08.02]` en CHANGELOG. Tocados: `app/components/PhotoPicker.tsx` (nuevo), `app/app/(app)/expense/new.tsx`, `app/stores/expenses.ts`, `app/schemas/expense.ts`.
- Commit `feat(extras)[08.02]: PhotoPicker en form de gasto + upload a Storage`.
