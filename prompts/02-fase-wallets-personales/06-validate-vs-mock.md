# 06 — Validación visual contra prototipo (Fase 2)

## Objetivo
Comparar las 3 pantallas implementadas (Home / Crear Wallet / Detalle) con el prototipo HTML lado a lado. Match visual ≥ 95% + microcopy 100%.

## Pre-requisitos
- Módulos 02.01..02.05 cerrados

## Contexto necesario
- `design_handoff_wallateam_mvp/WallaTeam Prototype.html` abierto en navegador
- Expo Go corriendo con la app actualizada

## Tareas

### Setup
- Tener al menos 3 wallets dummy creadas (variedad de íconos y colores)
- Toggle prototype HTML entre light y dark con el panel de tweaks
- Rotación de pestañas en el prototype: 02 (Home), 03 (Crear), 04 (Detalle)

---

### Checklist Home — light mode

**Top bar**
- [ ] Avatar circular 40px con iniciales del user logueado
- [ ] "Hola, {nombre}" 16px semibold
- [ ] Bell icon a la derecha con dot rojo de notificación

**BalanceCard**
- [ ] Gradient secondary→primary visible (no plano)
- [ ] Sombra `cardHi` del azul difusa
- [ ] BorderRadius 20
- [ ] Label "BALANCE TOTAL" 11px semibold uppercase letterSpacing 0.5 blanco@80%
- [ ] Monto principal 28px bold blanco con `fmtGs`
- [ ] Divider horizontal sutil 1px blanco@20%
- [ ] Columnas Personal / En equipo con divider vertical en el medio
- [ ] Montos compactos `fmtGsCompact`

**Quick actions (4)**
- [ ] Gasto: filled primary, icono blanco, texto debajo "Gasto"
- [ ] Wallet: subtle, icon textPrimary, texto "Wallet"
- [ ] Invitar: subtle, icon Users, texto "Invitar"
- [ ] Saldar: subtle, icon Split, texto "Saldar"
- [ ] Padding adecuado, justify-between, alignment vertical centrado

**Mis wallets section**
- [ ] SectionHeader "Mis wallets" + link "Ver todas" en primary
- [ ] Cada WalletRow: IconBox color del wallet + nombre + chip "PERSONAL" verde + monto compacto + "disponible" debajo
- [ ] Spacing entre rows correcto (gap 10)

**Actividad reciente**
- [ ] SectionHeader "Actividad reciente" + "Ver todo"
- [ ] 2 rows placeholder con texto "Próximamente — Fase 3"

**BottomNav**
- [ ] 5 slots, FAB central elevado con gradient + sombra
- [ ] Tab "home" activo (color primary)
- [ ] Otros en textSecondary

### Checklist Home — dark mode
- [ ] Background `#0E1B2C`
- [ ] Surface `#15263C`, surfaceAlt `#1B2E47`
- [ ] BalanceCard sigue legible (gradient correcto)
- [ ] Borders `#243B58`
- [ ] Text contrast OK
- [ ] BottomNav sigue contrastado

### Checklist Home — interactivo
- [ ] Tap quick action Wallet o FAB → abre Crear Wallet (modal)
- [ ] Tap WalletRow → abre Detalle de esa wallet
- [ ] Pull-to-refresh recarga
- [ ] Empty state visible si borrás todas las wallets

---

### Checklist Crear Wallet — light mode

**AppBar**
- [ ] ChevronLeft + "Nueva wallet" 17px semibold + subtitle "Personal" 12px

**Preview header**
- [ ] Gradient `[color, secondary]` del color elegido + secondary
- [ ] BorderRadius 20, sombra cardHi
- [ ] IconBox grande 64px del icono elegido (bg blanco@20%)
- [ ] Nombre 20px bold blanco (placeholder "Mi wallet")
- [ ] Chip "PERSONAL" o "EN EQUIPO" blanco custom
- [ ] "Solo vos" / "X miembros" 12px medium

**Type selector**
- [ ] Card Personal (active default) con ring primary
- [ ] Card En equipo deshabilitada con label "Próximamente Fase 4"

**Nombre**
- [ ] Input estilo WTField con counter `{n}/40` arriba a la derecha
- [ ] Placeholder "Viaje en familia, Hogar, Ahorros..."

**Ícono y color**
- [ ] Grid 4×2 con los 8 íconos (cada uno con su color de catálogo)
- [ ] Selected ring 3px primary + check overlay
- [ ] Color picker row de 8 swatches: `#16A085, #1F3A5F, #3B82F6, #2ECC71, #E74C3C, #F39C12, #9B59B6, #7F8C8D`
- [ ] Selected con border interno blanco + ring primary

**Moneda**
- [ ] PYG visible y selected
- [ ] USD/ARS/EUR deshabilitados con "Próximamente — Fase 7"

**Presupuesto**
- [ ] Input grande con `₲` prefix 22px y número 32px bold
- [ ] Quick-add chips `+100k +500k +1M +5M` con bg `chipBg` primary
- [ ] Tip "Puede ser tu meta..." debajo

**Opciones avanzadas**
- [ ] Header collapsible con ChevronDown/Up
- [ ] Toggle Fecha objetivo + DatePicker funcional
- [ ] Toggle Aviso de presupuesto + input %
- [ ] Toggle Wallet privada

**CTA bar fija**
- [ ] Cancelar (outline, flex 1) + Crear wallet (primary, flex 2)

### Checklist Crear Wallet — interactivo
- [ ] Cambiar nombre actualiza preview
- [ ] Cambiar icon → preview cambia ícono Y color default
- [ ] Cambiar color manualmente sobreescribe el color default del icon
- [ ] Quick-add suma al balance
- [ ] DatePicker abre y persiste
- [ ] Tap "Crear wallet" → vuelve al Home con la nueva wallet en la lista
- [ ] Cancelar cierra sin guardar
- [ ] Validación zod: nombre <2 chars muestra error inline
- [ ] Loading en botón Crear durante el insert

---

### Checklist Detalle Wallet — light mode

**Header gradient**
- [ ] `[wallet.color, secondary]` 135deg
- [ ] PaddingTop con safe area, paddingBottom 24, borderBottom radius 24
- [ ] ChevronLeft white + Settings white
- [ ] IconBox 56px white@20% + nombre wallet 22px bold blanco + Chip "PERSONAL" custom blanco

**Métricas**
- [ ] 3 metrics con label uppercase 11px sb 0.5 blanco@70% + value 18px bold
- [ ] "Restante" highlight (color distinto)

**Progress bar + texto**
- [ ] Barra 6px bg blanco@20%, fill blanco/accent
- [ ] Texto "0% usado · sin fecha objetivo" 11px regular

**Tabs underline**
- [ ] 3 items: Gastos (active, underline primary), Resumen, Miembros (disabled)
- [ ] Underline animado al cambiar (opcional)

**Empty state Gastos**
- [ ] IconBox Receipt 64px subtle
- [ ] "Todavía no hay gastos" 16px sb
- [ ] Subtitle "Cuando agregues un gasto aparecerá acá"
- [ ] Botón outline "Agregar gasto"

**FAB inferior**
- [ ] Visible bottom-right (opcional Fase 2)
- [ ] Tap → Alert "Próximamente"

### Checklist Detalle — dark + interactivo
- [ ] Dark mode: header gradient sigue legible
- [ ] Back vuelve al Home
- [ ] Settings dispara Alert
- [ ] Si abrís un id inventado: error + back

---

### Checklist Microcopy (100% literal)

**Home**
- [ ] "Hola, {nombre}"
- [ ] "BALANCE TOTAL"
- [ ] "PERSONAL" / "EN EQUIPO"
- [ ] "Mis wallets" / "Ver todas"
- [ ] "Actividad reciente" / "Ver todo"
- [ ] "Gasto" / "Wallet" / "Invitar" / "Saldar"
- [ ] "disponible"

**Crear Wallet**
- [ ] "Nueva wallet"
- [ ] "Personal" / "En equipo"
- [ ] "Solo vos" / "Próximamente Fase 4"
- [ ] "NOMBRE", "ÍCONO Y COLOR", "MONEDA", "PRESUPUESTO INICIAL", "Opciones avanzadas"
- [ ] "Tu moneda principal. Podrás cambiarla más adelante."
- [ ] "Puede ser tu meta de ahorro o el monto que asignás. Lo podés cambiar después."
- [ ] "Avisarme al X%"
- [ ] "Wallet privada" / "No aparece en el resumen general"
- [ ] "Cancelar" / "Crear wallet"

**Detalle**
- [ ] "Presupuesto", "Gastado", "Restante"
- [ ] "Gastos", "Resumen", "Miembros"
- [ ] "Todavía no hay gastos"
- [ ] "Cuando agregues un gasto aparecerá acá"
- [ ] "Agregar gasto"
- [ ] "X% usado · Y días restantes" (o "sin fecha objetivo")

---

### Resolver discrepancias

Para cada item con ⚠ o ❌:
- Trivial (color, padding, microcopy) → fixear y re-validar
- Estructural (limitación RN, decisión arquitectónica) → documentar en `bitacora/DECISIONS.md`

## Validación
- ≥ 95% checks visuales OK
- 100% microcopy literal
- Discrepancias documentadas

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [02.06] 2026-MM-DD — Validación visual Fase 2 vs prototipo
- ✅ Home: X/Y items light, A/B items dark, microcopy 7/7
- ✅ Crear Wallet: X/Y items, microcopy 11/11
- ✅ Detalle: X/Y items, microcopy 5/5
- 🧠 Desviaciones documentadas (si hubo)
- 📁 Tocados: solo correcciones de fix (en módulos previos)
```

### Update `STATE.md`
- **Último módulo completado:** 02.06-validate-vs-mock
- **Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/99-close-phase.md
