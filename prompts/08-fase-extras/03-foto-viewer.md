# 08.03 — Render de la foto del ticket en row, detalle y viewer

## Objetivo
Mostrar la foto adjunta al gasto en tres lugares: thumbnail pequeño en `ExpenseRow`, vista completa en el detalle del gasto, y `PhotoViewer` modal a pantalla completa cuando el usuario toca cualquiera de las dos.

## Pre-requisitos
- 08.02 completado (gastos con foto pueden crearse y editarse).
- Al menos un gasto con foto guardado para validación visual.

## Contexto necesario
- `app/components/ExpenseRow.tsx` — row actual.
- `app/lib/storage.ts` — `getSignedUrl(path)`.
- Patrón Modal/Sheet existente: `app/components/ConfirmDeleteSheet.tsx`.

## Tareas

### 1. Hook `useSignedPhoto(path | null)`
En `app/lib/storage.ts` agregar:

```ts
export function useSignedPhoto(path: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!path) { setUrl(null); return; }
    let cancelled = false;
    setLoading(true);
    getSignedUrl(path).then(u => { if (!cancelled) setUrl(u); })
      .catch(() => { if (!cancelled) setUrl(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [path]);
  return { url, loading };
}
```

> Cache: para MVP no cacheamos URLs entre componentes — cada `ExpenseRow` con foto pide la suya. Si en uso real esto pesa, se introduce un `Map<path, { url, expiresAt }>` en módulo aparte. **No lo hagas ahora.**

### 2. Thumbnail en `ExpenseRow`
- Si `expense.photo_url` está, mostrar un cuadrado 36×36 borde radio 8 a la izquierda del Avatar/IconBox actual. El `Image` con `source={{ uri: signedUrl }}` y `resizeMode="cover"`. Mientras `loading`, mostrar un placeholder gris (surfaceAlt).
- Tap sobre el thumbnail → abre `PhotoViewer` (ver paso 4). Importante: el tap del thumbnail NO debe disparar el tap del row entero (usar `Pressable` con `onPress` propio + `e.stopPropagation()` si aplica, o estructurar para que no haya un row Pressable wrapper sobre el thumbnail).

### 3. Foto en el detalle del gasto
Hay dos opciones para el detalle:
- **(a)** Si ya existe una pantalla de detalle del gasto separada: agregar la foto a ancho completo arriba con `aspectRatio: 4/3` y borde radio.
- **(b)** Si el "detalle" hoy es solo el sheet de edición (`expense/new.tsx` en modo edit): no agregar foto grande ahí — alcanzaría con el `PhotoPicker` que ya muestra el preview en modo edit.

**Revisar el estado actual** antes de implementar — leer `app/app/(app)/wallet/[id].tsx` para ver qué pasa al tap de un row (probablemente abre el editor). Si no hay pantalla de detalle dedicada, **saltar el paso 3** y dejar la foto grande sólo dentro del `PhotoViewer` (paso 4).

### 4. `PhotoViewer` modal (nuevo)
`app/components/PhotoViewer.tsx`:

```ts
interface Props {
  uri: string | null;
  onClose: () => void;
}

export function PhotoViewer({ uri, onClose }: Props);
```

UX:
- `Modal` (RN core) con `presentationStyle="fullScreen"` y `animationType="fade"`.
- Fondo `rgba(0,0,0,0.95)`.
- Imagen centrada, `resizeMode="contain"`, ancho 100%.
- Botón X arriba a la derecha (safe area top) con `Icon` blanco.
- Tap fuera de la imagen → cierra.
- Swipe down (opcional, post-MVP): cierra. Para MVP basta el botón X.

### 5. Wiring en `wallet/[id].tsx`
- Estado local `const [viewerUri, setViewerUri] = useState<string | null>(null)`.
- En el callback del thumbnail del row: `setViewerUri(signedUrl)`.
- Render del `<PhotoViewer uri={viewerUri} onClose={() => setViewerUri(null)} />` al final del componente.

## Validación
- `npm run typecheck` limpio.
- En Expo Go:
  - Gasto sin foto: row se ve igual que antes (sin thumbnail extra).
  - Gasto con foto: thumbnail 36×36 visible. Tap → modal a pantalla completa con la imagen. Tap fuera o en X → cierra.
  - Dos dispositivos / dos miembros del team: el miembro B también puede ver la foto que subió A (RLS de `photo_select_wallet_member` funciona).

## Bitácora
- Entry `[08.03]` en CHANGELOG. Tocados: `app/components/ExpenseRow.tsx`, `app/components/PhotoViewer.tsx` (nuevo), `app/lib/storage.ts`, `app/app/(app)/wallet/[id].tsx`.
- Commit `feat(extras)[08.03]: thumbnail + PhotoViewer para foto del ticket`.
