# 02 — Wallet store + queries Supabase

## Objetivo
Centralizar todo el data layer de wallets personales en `stores/wallets.ts`: tipos, queries Supabase (list/byId/create/archive), estado Zustand con cache, helpers derivados (balance total). Cero queries inline en pantallas.

## Pre-requisitos
- Módulo 02.01 cerrado (tabs layout activo)
- Tabla `wallets` en Supabase con RLS funcional (Fase 1.04)

## Contexto necesario
- `prompts/00-MASTER.md` sección 7 (modelo SQL)
- `app/supabase/schema.sql` (forma exacta de la tabla)
- `app/stores/auth.ts` (patrón Zustand a replicar)
- `app/lib/supabase.ts` (cliente a consumir)

## Tareas

### 1. Crear `app/lib/types.ts`

Tipos compartidos del dominio:

```ts
export type WalletType = 'personal' | 'team';

export type WalletIcon =
  | 'wallet' | 'piggy' | 'home' | 'plane'
  | 'briefcase' | 'gift' | 'sparkle' | 'shopping' | 'food';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  icon: WalletIcon;
  color: string;            // hex
  currency_code: string;    // 'PYG' default
  initial_balance: number;
  target_date: string | null;
  budget_alert_pct: number | null;
  is_private: boolean;
  owner_id: string;
  created_at: string;
  archived_at: string | null;
}

export interface NewWalletInput {
  name: string;
  type: WalletType;
  icon: WalletIcon;
  color: string;
  currency_code?: string;
  initial_balance?: number;
  target_date?: string | null;
  budget_alert_pct?: number | null;
  is_private?: boolean;
}
```

### 2. Crear `app/lib/walletIcons.ts`

Catálogo de los 8 iconos disponibles en Crear Wallet (ver mock `screen-create-wallet.jsx`). Mapeo `WalletIcon` → ícono lucide + color default:

```ts
import { IconName } from '@/components/Icon';

export interface WalletIconDef {
  id: WalletIcon;
  lucide: IconName;
  color: string;
  label: string;
}

export const WALLET_ICONS: WalletIconDef[] = [
  { id: 'piggy',     lucide: 'PiggyBank',  color: '#16A085', label: 'Ahorro' },
  { id: 'home',      lucide: 'Home',       color: '#1F3A5F', label: 'Hogar' },
  { id: 'plane',     lucide: 'Plane',      color: '#3B82F6', label: 'Viaje' },
  { id: 'briefcase', lucide: 'Briefcase',  color: '#7F8C8D', label: 'Trabajo' },
  { id: 'gift',      lucide: 'Gift',       color: '#E74C3C', label: 'Regalos' },
  { id: 'sparkle',   lucide: 'Sparkles',   color: '#F39C12', label: 'Eventos' },
  { id: 'shopping',  lucide: 'ShoppingBag',color: '#9B59B6', label: 'Compras' },
  { id: 'food',      lucide: 'UtensilsCrossed', color: '#2ECC71', label: 'Comida' },
];

// Default usado por wallet recién creada sin selección explícita
export const DEFAULT_WALLET_ICON: WalletIcon = 'wallet';
```

### 3. Crear `app/stores/wallets.ts`

Estado y acciones principales. Usar Zustand siguiendo el patrón de `auth.ts`. Estado:

```ts
interface WalletsState {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
  // actions
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<Wallet | null>;
  create: (input: NewWalletInput) => Promise<Wallet>;
  archive: (id: string) => Promise<void>;
  // selectors derivados
  byId: (id: string) => Wallet | undefined;
}
```

Implementación clave:

- `fetchAll()`: `supabase.from('wallets').select('*').is('archived_at', null).order('created_at', { ascending: false })`. RLS garantiza que solo aparezcan wallets propias o de equipos del user.
- `fetchById(id)`: `supabase.from('wallets').select('*').eq('id', id).maybeSingle()`. Si no existe o no tiene acceso, devuelve null.
- `create(input)`: requiere `owner_id` → tomar de `useAuth.getState().user!.id`. Defaults: `currency_code: 'PYG'`, `initial_balance: 0`, `is_private: false`. Devuelve la wallet recién creada (`.select().single()`).
- `archive(id)`: update con `archived_at: new Date().toISOString()`. Quita la wallet de la lista activa pero conserva historia (los gastos antiguos no se borran).
- `byId(id)`: lookup en cache local (`get().wallets.find(w => w.id === id)`). Si no está en cache, NO hace fetch — quien necesita freshness llama `fetchById` explícito.

Manejo de errores: cada acción setea `error` en el store y lo limpia al próximo intento exitoso. Las pantallas leen `error` y muestran toast/Alert.

### 4. Crear hook auxiliar `app/stores/wallets.ts` (mismo archivo)

```ts
export function useTotalBalance(): { personal: number; team: number; total: number } {
  const wallets = useWallets((s) => s.wallets);
  const userId = useAuth((s) => s.user?.id);
  // personal = sum(initial_balance) where type='personal' && owner_id=userId
  // team = sum(initial_balance) where type='team' && (owner OR member)
  // En Fase 2 solo hay personal; team queda en 0
}
```

**Nota Fase 2:** `initial_balance` representa el "saldo inicial / presupuesto" del wallet. El balance real al cerrar Fase 3 será `initial_balance - sum(expenses.amount)`. Por ahora, `useTotalBalance` solo suma `initial_balance` de wallets personales activas. Documentar este placeholder en `bitacora/DECISIONS.md` para que Fase 3 lo reemplace.

### 5. (Opcional pero recomendado) Crear suscripción realtime

Si querés que cambios en `wallets` se reflejen en otros devices del user automáticamente, agregar al final de `fetchAll()`:

```ts
// Subscribe una sola vez al canal de wallets
supabase
  .channel('wallets-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
    get().fetchAll();
  })
  .subscribe();
```

Documentar esta decisión en DECISIONS.md (suscripción simple, refetch completo en cualquier cambio — más sofisticado en Fase 4 cuando hay múltiples users en wallets de equipo).

### 6. Hidratar el store después del login

En `app/_layout.tsx`, dentro de `AuthGate` o un nuevo `useEffect`:

```tsx
const session = useAuth((s) => s.session);
const fetchAll = useWallets((s) => s.fetchAll);
useEffect(() => {
  if (session) fetchAll();
}, [session, fetchAll]);
```

Esto hace que apenas el user se loguea (o reabre con sesión persistida), las wallets se cargan en background.

### 7. Smoke test desde una pantalla temporal

Modificar `(tabs)/home.tsx` placeholder para listar las wallets crudas como JSON debug:

```tsx
const wallets = useWallets((s) => s.wallets);
const loading = useWallets((s) => s.loading);
return <Text>{loading ? 'cargando...' : JSON.stringify(wallets, null, 2)}</Text>;
```

Esto sirve para validar que las queries devuelven datos reales antes de construir la UI completa en módulo 03.

### 8. Insertar 2-3 wallets dummy desde Supabase Dashboard

Para tener data al validar:

```sql
-- En SQL editor del dashboard, reemplazar el uuid por el id de tu user
insert into wallets (name, type, icon, color, initial_balance, owner_id) values
  ('Mis ahorros',        'personal', 'piggy', '#16A085', 1500000, '<USER_ID>'),
  ('Viaje al Sur',       'personal', 'plane', '#3B82F6',  500000, '<USER_ID>'),
  ('Gastos del hogar',   'personal', 'home',  '#1F3A5F', 2000000, '<USER_ID>');
```

Tomar `<USER_ID>` de Authentication → Users en el dashboard.

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ Home placeholder muestra las 3 wallets dummy en JSON
- ✅ Si no hay wallets, muestra `[]`
- ✅ Si la query falla (ej. apagar internet), muestra el error
- ✅ Reabrir app con sesión persistida → wallets se hidratan automáticamente
- ✅ (Si activaste realtime) Insertar otra wallet desde el dashboard → aparece en la app sin reload manual

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [02.02] 2026-MM-DD — Wallet store + queries Supabase
- ✅ `lib/types.ts` con `Wallet`, `WalletType`, `WalletIcon`, `NewWalletInput`
- ✅ `lib/walletIcons.ts` con catálogo de 8 íconos (id, lucide, color, label)
- ✅ `stores/wallets.ts` Zustand: `wallets`, `loading`, `error`, `fetchAll`, `fetchById`, `create`, `archive`, `byId` selector
- ✅ Hook `useTotalBalance` (placeholder hasta Fase 3 — usa initial_balance, no balance real)
- ✅ Hidratación al login en root `_layout.tsx`
- ✅ (Opcional) Realtime subscription al channel `wallets-changes`
- ✅ Wallets dummy insertadas para validación
- 📁 Tocados: `app/lib/types.ts`, `app/lib/walletIcons.ts`, `app/stores/wallets.ts`, `app/app/_layout.tsx`, `app/app/(app)/(tabs)/home.tsx` (smoke test)
- 🧪 Verificación: home placeholder muestra wallets en JSON debug
- 🧠 Notas: ver DECISIONS.md sobre useTotalBalance placeholder y realtime simple
```

### Update `bitacora/DECISIONS.md`
- ADR: `useTotalBalance` usa `initial_balance` como balance hasta Fase 3 (cuando se reste sum de expenses)
- ADR (si aplicaste): suscripción realtime hace refetch completo al cambiar cualquier wallet

### Update `STATE.md`
- **Último módulo completado:** 02.02-wallet-store
- **Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/03-screen-home.md
