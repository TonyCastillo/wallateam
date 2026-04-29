# 03 — Screen Home

## Objetivo
Implementar la pantalla principal post-login con: top bar (avatar + saludo + bell), balance total card (gradient secondary→primary), 4 quick actions, sección "Mis wallets" con lista, sección "Actividad reciente" placeholder (datos reales en Fase 3). Match visual ≥95% contra el mock.

## Pre-requisitos
- Módulos 02.01 (tabs) y 02.02 (store) cerrados

## Contexto necesario

Lectura obligatoria:
- `design_handoff_wallateam_mvp/lib/screen-home.jsx` — ground truth
- `prompts/00-MASTER.md` (tokens, microcopy)
- `app/stores/wallets.ts` (datos a consumir)
- `app/lib/format.ts` (`fmtGsCompact`)
- `app/lib/walletIcons.ts` (mapping ícono → lucide + color)

Mock abierto en navegador: `WallaTeam Prototype.html` → tab "02 · Home".

## Tareas

### 1. Crear `app/components/IconBox.tsx`

Cuadradito coloreado con ícono adentro, usado en lista de wallets y otros lados. Props:
- `iconName: IconName` (lucide)
- `color: string` (hex)
- `size?: number` (default 44)
- `bgOpacity?: number` (default 0.15 — para que el bg sea `color@15%` translúcido)

Implementación: `<View>` con `borderRadius: 12`, `width/height = size`, `backgroundColor = color con alpha`, `alignItems/justifyContent center`, ícono centrado con `color` plano.

Helper para alpha: `function withAlpha(hex: string, alpha: number)` que devuelve `rgba(...)`. Hex puede ser de 6 chars. Convertir a r/g/b.

### 2. Crear `app/components/Chip.tsx`

Pill chip pequeño. Props: `label: string`, `tone: 'primary' | 'secondary' | 'success' | 'danger'` (default primary). Tamaños: `paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999`. Background = `theme.colors.chipBg` o `chipBgBlue` según tone. Texto 10px semibold uppercase letterSpacing 0.5, color = tone equivalente.

Para Fase 2 los tonos usados son `primary` (chip "PERSONAL" verde teal) y `secondary` (chip "EQUIPO" azul). Los otros tonos quedan reservados para fases siguientes.

### 3. Crear `app/components/BalanceCard.tsx`

La tarjeta gradient grande del top del Home. Props: `total: number`, `personal: number`, `team: number`. Render:

- Container: `borderRadius: 20`, `padding: 18`, `expo-linear-gradient` con colors=[secondary, primary], start={x:0,y:0}, end={x:1,y:1}, sombra `cardHi`, marginHorizontal 20
- Label "BALANCE TOTAL" 11px semibold uppercase letterSpacing 0.5, color blanco con opacity 0.8
- Monto grande: `fmtGs(total)`, 28px bold, color blanco
- Divider horizontal 1px white@20% margin vertical 14
- Row 2 columnas con divider vertical en el medio:
  - Columna izq: "PERSONAL" small label + `fmtGsCompact(personal)` 16px semibold blanco
  - Columna der: "EN EQUIPO" small label + `fmtGsCompact(team)` 16px semibold blanco

Los textos secundarios usan `Inter_500Medium` con opacity 0.85 para diferenciar del monto principal.

### 4. Crear `app/components/QuickAction.tsx`

Botón circular cuadrado con ícono + label debajo, usado en row de 4 quick actions. Props:
- `iconName: IconName`
- `label: string`
- `variant: 'filled' | 'subtle'` (filled = primary; subtle = surface)
- `onPress: () => void`

Render: `<Pressable>` columna gap 6, ícono dentro de `<View>` con bg/color según variant, label 11px medium centrado debajo. El item filled (Gasto) tiene bg primary y icon blanco; los subtle tienen bg `surface` con border y icon `textPrimary`.

### 5. Crear `app/components/WalletRow.tsx`

Fila de wallet en la lista. Props: `wallet: Wallet`, `onPress: () => void`.

Render:
- Container: `flexDirection: 'row'`, `alignItems: 'center'`, gap 12, padding 14, `backgroundColor: theme.colors.surface`, `borderRadius: 16`, sombra `card` ligera
- Izq: `<IconBox>` con `iconName` resolvido del catálogo `walletIcons.ts`, `color` de la wallet, size 44
- Centro: columna flex 1 gap 4
  - Row: nombre 15px semibold + `<Chip label="PERSONAL"|"EQUIPO" tone="primary"|"secondary" />`
  - Subtítulo 12px regular `textSecondary`: en Fase 2 dejar `'1 miembro'` para personal (más adelante mostrará "N miembros · activo hace X")
- Der: columna alineada a la derecha
  - Monto compacto 15px semibold (`fmtGsCompact(wallet.initial_balance)` por ahora) — color `textPrimary`
  - "disponible" 11px regular `textSecondary`

### 6. Crear `app/components/SectionHeader.tsx`

Header de sección con título a la izq y link "Ver todas" a la der. Props: `title: string`, `actionLabel?: string`, `onAction?: () => void`. 18px semibold título, 12px semibold primary el link.

### 7. Implementar `app/app/(app)/(tabs)/home.tsx`

Reemplazar el placeholder con la pantalla completa. Estructura top-down:

1. **Top bar** (no es header de stack — es parte del scroll content)
   - Padding horizontal 20, paddingTop 12
   - Row: Avatar 40px (del `useAuth().user`, iniciales del full_name) + columna "Hola," `textSecondary` 12px + nombre `fontFamily.semibold` 16px → flex 1 → `<Pressable>` con icon Bell + dot rojo opcional (sin notifs reales aún)

2. **BalanceCard** consumiendo `useTotalBalance()`

3. **Quick actions row** (4 items, justify-between, padding horizontal 20, marginTop 18)
   - Gasto (filled, navega a `/expense/new` placeholder Fase 3 → mostrar `Alert("Próximamente")`)
   - Wallet (subtle, navega a `/create-wallet` ✅)
   - Invitar (subtle, Alert "Próximamente Fase 4")
   - Saldar (subtle, Alert "Próximamente Fase 6")

4. **SectionHeader** "Mis wallets" + actionLabel "Ver todas" (Alert "Próximamente")

5. **Lista de wallets**: `<FlatList>` o `<View>` (si <10 items) con `WalletRow` por cada wallet. Tap → `router.push('/wallet/' + wallet.id)`. Loading state: 3 skeleton rows. Empty state: card centrada "Todavía no tenés wallets" + botón "Crear tu primera wallet".

6. **SectionHeader** "Actividad reciente" + actionLabel "Ver todo"

7. **Lista de actividad placeholder**: 2 cards skeleton con texto "Próximamente — Fase 3" (gastos reales). Mismo estilo que WalletRow para consistency.

### 8. Pull-to-refresh

Envolver el contenido en `<ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAll} />}>`. Usar el `loading` y `fetchAll` del store.

### 9. Empty state CTA

Si `wallets.length === 0`, renderizar una card centrada en lugar de la lista:

```tsx
<View style={{ alignItems: 'center', padding: 24, gap: 12 }}>
  <IconBox iconName="Wallet" color={theme.colors.primary} size={64} />
  <Text style={[text.semibold, { fontSize: 16 }]}>Todavía no tenés wallets</Text>
  <Text style={[text.regular, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
    Creá una wallet para empezar a organizar tus gastos.
  </Text>
  <Button label="Crear mi primera wallet" iconRight="Plus" onPress={() => router.push('/create-wallet')} />
</View>
```

### 10. Skeleton loading

Mientras `loading && wallets.length === 0`, mostrar 3 placeholder rows con `backgroundColor: theme.colors.surfaceAlt`, sin texto, animación opcional. Componente reutilizable `<WalletRowSkeleton />` ayuda.

## Validación

- ✅ `tsc --noEmit` limpio
- ✅ Visual matchea mock: balance card gradient + 4 quick actions + lista wallets con chips
- ✅ Tap en una wallet → navega a `/wallet/[id]` (placeholder hasta módulo 05)
- ✅ Tap en FAB o quick action Wallet → abre Crear Wallet
- ✅ Pull-to-refresh recarga lista
- ✅ Si no hay wallets → empty state visible
- ✅ Dark mode: gradient sigue visible, contrastes correctos
- ✅ Saludo muestra nombre del user logueado

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [02.03] 2026-MM-DD — Pantalla Home (wallets personales)
- ✅ Componentes: IconBox (con helper withAlpha), Chip (primary/secondary tones), BalanceCard (gradient secondary→primary), QuickAction (filled/subtle), WalletRow, SectionHeader
- ✅ Pantalla `(tabs)/home.tsx` completa: top bar + BalanceCard + 4 quick actions + Mis wallets list + Actividad placeholder
- ✅ Pull-to-refresh con RefreshControl
- ✅ Empty state con CTA "Crear mi primera wallet"
- ✅ Skeleton loading rows
- 📁 Tocados: `app/components/{IconBox,Chip,BalanceCard,QuickAction,WalletRow,SectionHeader}.tsx`, `app/app/(app)/(tabs)/home.tsx`
- 🧪 Verificación: lista de wallets dummy se ve correctamente, navegación a Crear/Detalle funciona
```

### Update `STATE.md`
- **Último módulo completado:** 02.03-screen-home
- **Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/04-screen-create-wallet.md
