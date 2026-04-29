# 01 — Expense store + queries Supabase

## Objetivo
Centralizar toda la lógica de expenses en `stores/expenses.ts`: tipos, queries CRUD contra Supabase (incluyendo el insert atómico de `expenses` + `expense_splits`), cache en memoria por `wallet_id`, helper `totalsByWallet(walletId)` para el recálculo de métricas.

## Pre-requisitos
- Fase 2 cerrada
- Tabla `expenses` y `expense_splits` con RLS activa (Fase 1.04)

## Contexto necesario
- `prompts/00-MASTER.md` sección 7 (modelo SQL)
- `app/stores/wallets.ts` (patrón a replicar)
- `app/lib/types.ts` (extender con tipos de expense)

## Tareas

### 1. Catálogo de categorías

Crear `app/lib/categories.ts`:

```ts
import { IconName } from '@/components/Icon';

export type CategoryId =
  | 'food' | 'transport' | 'home' | 'shopping'
  | 'entertainment' | 'health' | 'work' | 'other';

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: IconName;
  color: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'food',          label: 'Comida',         icon: 'UtensilsCrossed', color: '#2ECC71' },
  { id: 'transport',     label: 'Transporte',     icon: 'Car',             color: '#3B82F6' },
  { id: 'home',          label: 'Hogar',          icon: 'Home',            color: '#1F3A5F' },
  { id: 'shopping',      label: 'Compras',        icon: 'ShoppingBag',     color: '#9B59B6' },
  { id: 'entertainment', label: 'Entretenimiento',icon: 'Sparkles',        color: '#F39C12' },
  { id: 'health',        label: 'Salud',          icon: 'Heart',           color: '#E74C3C' },
  { id: 'work',          label: 'Trabajo',        icon: 'Briefcase',       color: '#7F8C8D' },
  { id: 'other',         label: 'Otro',           icon: 'Tag',             color: '#16A085' },
];

export function categoryById(id: string | null | undefined): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
```

### 2. Extender tipos en `app/lib/types.ts`

Agregar al archivo existente:

```ts
import { CategoryId } from './categories';

export type SplitMode = 'equal' | 'percent' | 'amount';

export interface ExpenseSplit {
  expense_id: string;
  user_id: string;
  percentage: number | null;
  amount: number;
}

export interface Expense {
  id: string;
  wallet_id: string;
  description: string;
  amount: number;
  category: CategoryId | null;
  paid_by: string;
  occurred_at: string;
  photo_url: string | null;
  note: string | null;
  split_mode: SplitMode;
  created_at: string;
}

export interface NewExpenseInput {
  wallet_id: string;
  description: string;
  amount: number;
  category: CategoryId;
  occurred_at?: string;
  note?: string | null;
  // En Fase 3: paid_by se infiere del user actual; split_mode='equal' fijo
}
```

### 3. Crear `app/stores/expenses.ts`

```ts
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuth } from './auth';
import { Expense, NewExpenseInput } from '@/lib/types';

interface ExpensesState {
  /** Cache: gastos por wallet_id */
  byWallet: Record<string, Expense[]>;
  loading: boolean;
  error: string | null;

  /** Carga todos los gastos visibles para el user (RLS filtra por membership) */
  fetchAll: () => Promise<void>;
  /** Carga gastos de UNA wallet específica (override) */
  fetchByWallet: (walletId: string) => Promise<Expense[]>;
  /** Crea expense + expense_split (1 split = paid_by con 100%) en Fase 3 */
  create: (input: NewExpenseInput) => Promise<Expense>;
  /** Actualiza descripción, amount, category, occurred_at, note */
  update: (id: string, patch: Partial<NewExpenseInput>) => Promise<Expense>;
  /** Elimina expense (cascade borra splits via FK) */
  remove: (id: string) => Promise<void>;

  /** Selectors */
  list: (walletId: string) => Expense[];
  totals: (walletId: string) => { spent: number; count: number };
}
```

Implementación clave:

#### a. `fetchAll` y `fetchByWallet`

```ts
fetchAll: async () => {
  set({ loading: true, error: null });
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('occurred_at', { ascending: false });
    if (error) throw error;
    const grouped: Record<string, Expense[]> = {};
    (data as Expense[]).forEach((e) => {
      grouped[e.wallet_id] ??= [];
      grouped[e.wallet_id].push(e);
    });
    set({ byWallet: grouped, loading: false });
    setupRealtimeOnce();
  } catch (err: any) {
    set({ error: err.message, loading: false });
  }
},

fetchByWallet: async (walletId) => {
  set({ loading: true, error: null });
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('wallet_id', walletId)
      .order('occurred_at', { ascending: false });
    if (error) throw error;
    set((s) => ({
      byWallet: { ...s.byWallet, [walletId]: data as Expense[] },
      loading: false,
    }));
    return data as Expense[];
  } catch (err: any) {
    set({ error: err.message, loading: false });
    return [];
  }
},
```

#### b. `create` con split atómico

**Crítico**: insertar `expense` y `expense_split` debe ser atómico (si falla el split, el expense huérfano queda mal). Mejor usar una **transacción RPC** vía Postgres function:

Opción A (recomendada) — crear función SQL helper:

```sql
-- Correr en Supabase SQL editor
create or replace function public.create_expense_with_split(
  p_wallet_id uuid,
  p_description text,
  p_amount numeric,
  p_category text,
  p_paid_by uuid,
  p_occurred_at timestamptz,
  p_note text default null
)
returns expenses
language plpgsql
security invoker
as $$
declare
  new_expense expenses;
begin
  insert into expenses (wallet_id, description, amount, category, paid_by, occurred_at, note, split_mode)
  values (p_wallet_id, p_description, p_amount, p_category, p_paid_by, p_occurred_at, p_note, 'equal')
  returning * into new_expense;

  insert into expense_splits (expense_id, user_id, percentage, amount)
  values (new_expense.id, p_paid_by, 100.00, p_amount);

  return new_expense;
end;
$$;
```

Este archivo se guarda como `app/supabase/expenses_rpc.sql`. El módulo le pide al usuario correrlo en el dashboard (igual que schema/policies).

Luego desde el cliente:

```ts
create: async (input) => {
  const userId = useAuth.getState().user?.id;
  if (!userId) throw new Error('Usuario no autenticado');
  set({ loading: true, error: null });
  try {
    const { data, error } = await supabase.rpc('create_expense_with_split', {
      p_wallet_id: input.wallet_id,
      p_description: input.description,
      p_amount: input.amount,
      p_category: input.category,
      p_paid_by: userId,
      p_occurred_at: input.occurred_at ?? new Date().toISOString(),
      p_note: input.note ?? null,
    });
    if (error) throw error;
    const created = data as Expense;
    set((s) => ({
      byWallet: {
        ...s.byWallet,
        [input.wallet_id]: [created, ...(s.byWallet[input.wallet_id] ?? [])],
      },
      loading: false,
    }));
    return created;
  } catch (err: any) {
    set({ error: err.message, loading: false });
    throw err;
  }
},
```

Opción B (sin RPC) — dos queries secuenciales con cleanup en error. Funciona pero deja ventana de inconsistencia si la app crashea entre el insert del expense y el del split. Si vas con esta opción, agregalo como ADR.

#### c. `update`

Solo actualiza fields del expense; en Fase 3 el split single = expense.amount, así que si cambia amount también hay que actualizar el split:

```ts
update: async (id, patch) => {
  set({ loading: true, error: null });
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    const updated = data as Expense;
    if (patch.amount !== undefined) {
      // sync split
      await supabase
        .from('expense_splits')
        .update({ amount: patch.amount, percentage: 100 })
        .eq('expense_id', id);
    }
    set((s) => ({
      byWallet: {
        ...s.byWallet,
        [updated.wallet_id]: (s.byWallet[updated.wallet_id] ?? []).map((e) =>
          e.id === id ? updated : e,
        ),
      },
      loading: false,
    }));
    return updated;
  } catch (err: any) {
    set({ error: err.message, loading: false });
    throw err;
  }
},
```

#### d. `remove`

Cascade borra splits via FK constraint (`on delete cascade` en `expense_splits.expense_id`):

```ts
remove: async (id) => {
  set({ loading: true, error: null });
  try {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    set((s) => {
      const next: Record<string, Expense[]> = {};
      Object.entries(s.byWallet).forEach(([k, list]) => {
        next[k] = list.filter((e) => e.id !== id);
      });
      return { byWallet: next, loading: false };
    });
  } catch (err: any) {
    set({ error: err.message, loading: false });
    throw err;
  }
},
```

#### e. `totals` y `list` selectors

```ts
list: (walletId) => get().byWallet[walletId] ?? [],
totals: (walletId) => {
  const list = get().byWallet[walletId] ?? [];
  return {
    spent: list.reduce((acc, e) => acc + Number(e.amount), 0),
    count: list.length,
  };
},
```

#### f. Realtime subscription

```ts
let isSubscribed = false;
function setupRealtimeOnce() {
  if (isSubscribed) return;
  isSubscribed = true;
  supabase
    .channel('expenses-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
      useExpenses.getState().fetchAll();
    })
    .subscribe();
}
```

### 4. Hidratar al login

En `app/_layout.tsx`, dentro del `useEffect` que ya hidrata wallets:

```ts
useEffect(() => {
  if (session) {
    fetchAllWallets();
    fetchAllExpenses();   // ← agregar
  }
}, [session]);
```

### 5. Smoke test temporal

Agregar al final del Detalle Wallet (`app/(app)/wallet/[id].tsx`) un `console.log` o pequeño debug:

```tsx
const expenses = useExpenses((s) => s.list(wallet.id));
const totals = useExpenses((s) => s.totals(wallet.id));
console.log('expenses for', wallet.id, expenses.length, 'spent:', totals.spent);
```

(Después se borra al hacer 02-expense-row-list)

### 6. Insertar 1-2 expenses de prueba desde Supabase

```sql
-- Desde SQL editor del dashboard. Reemplazar UUIDs.
do $$
declare
  v_wallet uuid := '<WALLET_ID>';      -- pegar id de una wallet tuya
  v_user uuid := '<USER_ID>';          -- pegar id del user (auth.users)
  v_exp uuid;
begin
  insert into expenses (wallet_id, description, amount, category, paid_by, occurred_at, split_mode)
  values (v_wallet, 'Cena prueba', 150000, 'food', v_user, now(), 'equal')
  returning id into v_exp;

  insert into expense_splits (expense_id, user_id, percentage, amount)
  values (v_exp, v_user, 100, 150000);
end $$;
```

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ Smoke debug en Detalle muestra `expenses.length` correcto
- ✅ `totals.spent` matchea la suma de los inserts manuales
- ✅ Realtime: insertar otra row desde dashboard → aparece en log
- ✅ `delete from expenses where id='...'` desde dashboard → desaparece del log

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [03.01] 2026-MM-DD — Expense store + queries Supabase
- ✅ `lib/categories.ts` con catálogo cerrado de 8 categorías (id, label, icon lucide, color)
- ✅ `lib/types.ts` extendido con `Expense`, `ExpenseSplit`, `SplitMode`, `NewExpenseInput`
- ✅ `supabase/expenses_rpc.sql` con función `create_expense_with_split` (insert atómico expense + split)
- ✅ `stores/expenses.ts` Zustand: cache `byWallet`, `fetchAll`/`fetchByWallet`, `create` (vía RPC), `update`, `remove`, selectors `list` y `totals`
- ✅ Realtime subscription al canal `expenses-changes`
- ✅ Hidratación al login en root `_layout.tsx`
- ✅ Usuario corrió RPC SQL en dashboard
- 📁 Tocados: `app/lib/categories.ts`, `app/lib/types.ts`, `app/stores/expenses.ts`, `app/supabase/expenses_rpc.sql`, `app/app/_layout.tsx`
- 🧪 Verificación: smoke debug en Detalle muestra expenses cargados
```

### Update `bitacora/DECISIONS.md`
- ADR sobre `create_expense_with_split` RPC vs dos queries separadas (atomicidad)

### Update `STATE.md`
- **Último módulo completado:** 03.01-expense-store
- **Próximo módulo a ejecutar:** prompts/03-fase-gastos/02-expense-row-list.md
