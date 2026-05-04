# 04.03 — Pantalla "Aceptar invitación" via deep link

## Objetivo
Crear la ruta `app/(app)/invite/[code].tsx` que se activa cuando el usuario abre `wallateam://invite/CODE`. La pantalla muestra el nombre de la wallet, un botón "Unirme" y maneja los casos de error (invite no válido, expirado, ya aceptado).

## Pre-requisitos
- 04.02 cerrado
- `scheme=wallateam` ya configurado en `app.json` desde Fase 1

## Cambios

### `app/(app)/_layout.tsx`
Registrar la ruta:
```tsx
<Stack.Screen name="invite/[code]" options={{ presentation: 'modal', title: 'Invitación' }} />
```

### `app/(app)/invite/[code].tsx` (nuevo)
Flujo:
1. Leer `code` de `useLocalSearchParams`
2. Al montar: `supabase.from('wallet_invites').select('*, wallets(name,color,icon)').eq('invite_code', code).single()`
3. Si no existe o `status !== 'pending'` → mostrar "Invitación no válida o ya usada" con botón Volver
4. Si `expires_at` pasó → "Invitación vencida"
5. Si válido: mostrar card con nombre de wallet, color, ícono + botón "Unirme al equipo"
6. Tap "Unirme" → `useInvites.getState().accept(code)` → navegar a `/wallet/{wallet_id}` o al Home

UI simplificada (no necesita ser pixel-perfect para esta fase):
- Fondo `theme.colors.background`
- Card central con gradient del color de la wallet, nombre y tipo "Equipo"
- Texto "Fuiste invitado a unirte a esta wallet"
- Button primary "Unirme al equipo" + Button outline "Cancelar"
- Estado loading con ActivityIndicator

### `expo-linking` (para testear el deep link desde terminal)
```bash
# En el emulador o dispositivo físico con Expo Go:
npx uri-scheme open wallateam://invite/TEST123 --android
# o en iOS:
xcrun simctl openurl booted wallateam://invite/TEST123
```

## Microcopy (literal)
- `"Fuiste invitado a unirte a esta wallet"`
- `"Unirme al equipo"`
- `"Cancelar"`
- `"Invitación no válida o ya usada"`
- `"Invitación vencida"`

## Validación
- Abrir `wallateam://invite/{code_válido}` → muestra wallet correctamente
- Tap "Unirme" → aparece como miembro en Supabase, redirige al Detalle
- `wallateam://invite/FAKE` → muestra error

## Cierre
```markdown
## [04.03] YYYY-MM-DD — Deep link invitación
- ✅ Ruta `/invite/[code]` registrada como modal
- ✅ Lookup del invite con datos del wallet
- ✅ Estados: válido / inválido / vencido / ya aceptado
- ✅ Tap "Unirme" acepta invite y redirige al Detalle
- 📁 Tocados: app/(app)/invite/[code].tsx, app/(app)/_layout.tsx
```
