# 05 — Screen Detalle de Wallet

## Objetivo
Pantalla `/wallet/[id]` con header gradient (ícono + nombre + chip), métricas (presupuesto / gastado / restante con barra de progreso), tabs (Gastos / Resumen / Miembros), y lista de gastos placeholder. La sección "Balance del grupo" del mock se omite (Fase 6) y "Miembros" se omite (Fase 4).

## Pre-requisitos
- Módulos 02.01..02.04 cerrados
- Existen wallets reales en Supabase (creadas con la pantalla anterior)

## Contexto necesario
- `design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx` — ground truth
- `prompts/00-MASTER.md`
- `app/stores/wallets.ts` (`byId`, `fetchById`)

## Tareas

### 1. Crear `app/components/Tabs.tsx`

Componente de tabs con underline animado abajo. Props:

```ts
interface Props<T extends string> {
  items: { key: T; label: string; disabled?: boolean }[];
  active: T;
  onChange: (k: T) => void;
}
```

Render: `<View>` row con borderBottomWidth 1 borderColor border. Cada item: padding 12 horizontal, paddingVertical 12, borderBottomWidth 2 (transparent inactivo, primary activo), label 14px semibold (primary activo, textSecondary inactivo, textSecondary@40 disabled).

Distinto al tabs del Login (que era un segmented control con bg) — este es underline-style. Hacer un componente nuevo, no reusar.

### 2. Crear `app/components/ProgressBar.tsx`

Barra horizontal de progreso. Props: `value: number` (0..1), `tint?: string` (default primary), `bg?: string` (default surfaceAlt). Render: container 6px height bg con borderRadius full, hijo bg=tint width=value*100% con animación cuando cambia (Reanimated o LayoutAnimation, opcional).

### 3. Crear `app/components/Metric.tsx`

Cell de métrica. Props: `label: string`, `value: string`, `highlight?: boolean`. Layout en columna gap 4. Label 11px medium uppercase letterSpacing 0.5 textSecondary; value 18px bold (primary si highlight, textPrimary si no).

### 4. Crear `app/components/EmptyExpenses.tsx`

Estado vacío de gastos. IconBox `Receipt` 64px subtle + texto "Todavía no hay gastos" 16px semibold + subtitle "Cuando agregues un gasto aparecerá acá" + Button outline "Agregar gasto" (Alert "Próximamente — Fase 3"). Usar en módulo 05 hasta que Fase 3 traiga gastos reales.

### 5. Pantalla `app/app/(app)/wallet/[id].tsx`

Crear el archivo (carpeta `wallet/`). Estructura top-down:

#### a. Header gradient
- Container: gradient `[wallet.color, secondary]` 135deg, paddingTop con safe area, paddingBottom 24, paddingHorizontal 20, borderBottomLeftRadius/RightRadius 24
- Top row: `<Pressable>` ChevronLeft 24 white (back) + `flex 1` + `<Pressable>` Settings 22 white (Alert "Próximamente")
- Title row marginTop 16: IconBox del wallet (size 56, bg blanco@20%, icon white) + columna gap 4:
  - Nombre 22px bold blanco
  - Chip "PERSONAL" tone="surface" custom (bg blanco@20% white text)
- **Métricas row** marginTop 20, justify-between:
  - `<Metric label="Presupuesto" value={fmtGsCompact(wallet.initial_balance)} />` (texto blanco)
  - `<Metric label="Gastado" value="₲ 0" />` (placeholder Fase 3)
  - `<Metric label="Restante" value={fmtGsCompact(wallet.initial_balance)} highlight />`
  
  En Fase 2 todos los gastos son 0 → restante == initial_balance. Custom tone para que se vea sobre gradient: textSecondary blanco@70%, value blanco.
- Progress bar marginTop 12, value=0 (Fase 3 calcula real)
- Texto debajo `0% usado` "·" `target_date ? 'X días restantes' : 'Sin fecha objetivo'` 11px regular blanco@70%

#### b. Tabs row (con underline)
- `<Tabs items={[{key:'gastos',label:'Gastos'},{key:'resumen',label:'Resumen'},{key:'miembros',label:'Miembros',disabled:true}]} active={tab} onChange={setTab} />`
- Para Fase 2: solo "Gastos" visible. "Resumen" y "Miembros" pueden quedar disabled o mostrar placeholders.

#### c. Tab content
- **Gastos**: `<EmptyExpenses />` (Fase 3 reemplaza con FlatList real)
- **Resumen**: placeholder card "Próximamente — Fase 8 (charts)"
- **Miembros**: solo visible si `wallet.type === 'team'` (Fase 4); por ahora forzar disabled.

#### d. FAB inferior derecho (opcional)
- Botón flotante "Agregar gasto" similar al FAB del BottomNav pero más chico, position absolute bottom-right. Por ahora `Alert("Próximamente — Fase 3")`. Fase 3 lo wirea a `/expense/new?walletId=...`.

### 6. Wiring

```tsx
const { id } = useLocalSearchParams<{ id: string }>();
const wallet = useWallets((s) => s.byId(id));
const fetchById = useWallets((s) => s.fetchById);

useEffect(() => {
  if (!wallet && id) fetchById(id);
}, [id, wallet, fetchById]);

if (!wallet) return <LoadingScreen />;  // simple spinner centrado
```

### 7. Loading y error states

- Si `byId(id)` devuelve undefined y `fetchById` aún no terminó → spinner centrado
- Si `fetchById` retorna null → Alert "Wallet no encontrada o sin acceso" + `router.back()`
- Header gradient skeleton mientras carga

### 8. Settings y Edit (placeholder)

El icon Settings del header dispara `Alert("Editar wallet — Próximamente")`. Edit completo se difiere a un módulo futuro o como mejora dentro de la propia Fase 2 si sobra tiempo.

## Validación

- ✅ Tap en una WalletRow del Home → abre Detalle
- ✅ Header gradient con color de la wallet + ícono correcto + nombre + chip
- ✅ Métricas muestran initial_balance correcto, gastado=₲ 0, restante=initial
- ✅ Progress bar al 0%
- ✅ Tabs visibles, "Resumen" y "Miembros" disabled o placeholder
- ✅ Estado vacío de gastos visible
- ✅ Back vuelve al Home
- ✅ Settings dispara Alert
- ✅ FAB de gasto dispara Alert
- ✅ Si la wallet no existe (id inventado) → muestra error y vuelve atrás
- ✅ Dark mode

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [02.05] 2026-MM-DD — Pantalla Detalle de Wallet
- ✅ Componentes: Tabs (underline-style), ProgressBar, Metric, EmptyExpenses
- ✅ Pantalla `(app)/wallet/[id].tsx` con header gradient (color wallet → secondary), métricas, progress bar, tabs (Gastos activo, Resumen/Miembros placeholder), empty state de gastos
- ✅ Wiring con `useWallets.byId` + fallback `fetchById` si no en cache
- ✅ Loading y error states (404 → Alert + back)
- ✅ Settings y FAB con Alert "Próximamente"
- 📁 Tocados: `app/components/{Tabs,ProgressBar,Metric,EmptyExpenses}.tsx`, `app/app/(app)/wallet/[id].tsx`
- 🧪 Verificación: tap wallet → detalle correcto; id inválido → error gracioso
```

### Update `STATE.md`
- **Último módulo completado:** 02.05-screen-wallet-detail
- **Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/06-validate-vs-mock.md
