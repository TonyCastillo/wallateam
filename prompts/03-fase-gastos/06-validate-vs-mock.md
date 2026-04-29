# 06 — Validación visual contra prototipo (Fase 3)

## Objetivo
Comparar las pantallas/secciones nuevas (lista de gastos en Detalle + pantalla Agregar Gasto + edit) con el mock HTML lado a lado. Match objetivo ≥95% visual + 100% microcopy.

## Pre-requisitos
- Módulos 03.01..03.05 cerrados

## Setup
- Tener al menos 1 wallet personal con 3+ gastos creados (categorías variadas)
- Un gasto que llegue al >100% del presupuesto para validar over-budget
- Prototype HTML abierto en `WallaTeam Prototype.html` → tab "05 · Agregar Gasto" y "04 · Detalle Wallet"
- Expo en Expo Go o web responsive (375-414px ancho)

---

## Checklist Detalle Wallet — sección Gastos

**ExpenseRow visual**
- [ ] IconBox 40px con color del catálogo (Comida=verde, Transporte=azul, etc.)
- [ ] Descripción 15px semibold textPrimary
- [ ] "Pagó {Vos} · {Hoy · 14:30}" 12px regular textSecondary
- [ ] Monto con `−` (minus signo Unicode, NO guion ASCII) 15px semibold
- [ ] Sombra `card` ligera

**Lista**
- [ ] FlatList con gap 8 entre rows
- [ ] PaddingBottom 96 para no chocar con FAB
- [ ] Pull-to-refresh OK
- [ ] Skeleton cuando carga
- [ ] EmptyExpenses sigue visible cuando 0 gastos

**Métricas header (con datos reales)**
- [ ] "Gastado" muestra suma real
- [ ] "Restante" = presupuesto - gastado
- [ ] ProgressBar al `usedPct * 100`%
- [ ] Texto "{X}% usado · {días}"
- [ ] Si `usedPct >= 1` → texto en warning amarillo

**Interactivo**
- [ ] Tap en ExpenseRow → abre Editar gasto con datos precargados
- [ ] Long-press en ExpenseRow → ActionSheet/Alert con Editar/Eliminar
- [ ] FAB del Detalle navega a Agregar Gasto con walletId precargado

---

## Checklist Pantalla Agregar Gasto — light mode

**AppBar**
- [ ] Pressable back con icon `ArrowLeft` 20 textPrimary en círculo 36×36 surface con border 1px
- [ ] Title "Nuevo gasto" 16px bold letterSpacing -0.2
- [ ] Subtitle "Registrá un movimiento" 11px regular textSecondary

**Card monto**
- [ ] Surface + border 1px, padding 18, borderRadius 18, marginTop 6
- [ ] Label "MONTO" 11px sb 0.3 letterSpacing uppercase textSecondary
- [ ] Símbolo `₲` 22px sb textSecondary
- [ ] Número 36px bold textPrimary letterSpacing -1
- [ ] Máscara aplicada: `120000` → `120.000`
- [ ] Chip below: bg `chipBg` primary, padding 4×10, radius 8, gap 6, icon `Tag` 12 + texto "Guaraníes (PYG)" 11px sb primary

**FormRow Descripción**
- [ ] Icon `Tag` en círculo 36×36 borderRadius 10 bg `theme.colors.background`, icon primary 16px
- [ ] Label uppercase "DESCRIPCIÓN" 10px sb 0.4
- [ ] Value: TextInput 13px sb textPrimary
- [ ] Sin chevron-right (es input directo)

**FormRow Categoría**
- [ ] Icon resuelto del catálogo
- [ ] Label "CATEGORÍA"
- [ ] Value: nombre de categoría
- [ ] ChevronRight a la derecha
- [ ] Tap abre `CategoryPicker` modal sheet desde abajo

**FormRow Wallet**
- [ ] Icon `Wallet`
- [ ] Label "WALLET"
- [ ] Value: nombre de wallet
- [ ] Chip "PERSONAL" tone=primary verde
- [ ] ChevronRight + tap abre `WalletPickerSheet`

**FormRow Fecha**
- [ ] Icon `Calendar`
- [ ] Label "FECHA"
- [ ] Value: "Hoy · 17 mar 2026"
- [ ] subValue: hora "20:30"
- [ ] Tap abre DateTimePicker

**FormRow Pagado por**
- [ ] Icon `User`
- [ ] Label "PAGADO POR"
- [ ] Value: nombre del user
- [ ] Trailing: `<Avatar name={fullName} size={26} />` (no chevron porque no es editable)
- [ ] **No tappable** en Fase 3

**Sección Cómo dividir (disabled)**
- [ ] Card surface + border, padding 16, borderRadius 18, marginTop 14
- [ ] Header: "Cómo dividir" 13px bold + subtitle "Multi-split disponible en Fase 5" 11px textSecondary
- [ ] Segmented control `=` `%` `₲` con `=` activo (primary bg, white text), otros gris
- [ ] **Toda la sección con opacity 0.6** y no tappable
- [ ] Una SplitRow placeholder: avatar "Vos" + barra full primary→accent + "100%" + monto compacto
- [ ] Footer: "Total asignado: 100% · ₲ {amount}" en accent green

**Sección Adjuntar ticket**
- [ ] Row gap 10 marginTop 12
- [ ] Card flex 1: dashed border, icon `Camera` + texto "Adjuntar ticket" 12 textSecondary
- [ ] Card 50×50: dashed border, icon `Plus` 18 textSecondary
- [ ] Tap → Alert "Próximamente — Fase 8"

**CTA bar**
- [ ] Padding `10px 18px 14px` con safe area, borderTopWidth 1
- [ ] Cancelar (outline, flex 1) "Cancelar"
- [ ] Guardar gasto (primary gradient 130°, flex 2) con icon `Check` 18 + "Guardar gasto"
- [ ] Sombra teal del CTA visible

---

## Checklist modo Edit

- [ ] AppBar title "Editar gasto"
- [ ] AppBar subtitle "Modificá los datos"
- [ ] CTA dice "Guardar cambios"
- [ ] Wallet field bloqueado (no abre picker o muestra warning)
- [ ] Botón "Eliminar gasto" rojo outline con icon Trash2 visible al fondo
- [ ] Eliminar dispara confirmación

---

## Checklist Microcopy (100% literal)

**Pantalla Agregar Gasto**
- [ ] "Nuevo gasto" / "Editar gasto"
- [ ] "Registrá un movimiento" / "Modificá los datos"
- [ ] "MONTO" / "DESCRIPCIÓN" / "CATEGORÍA" / "WALLET" / "FECHA" / "PAGADO POR"
- [ ] "Guaraníes (PYG)"
- [ ] "Cómo dividir"
- [ ] "Multi-split disponible en Fase 5"
- [ ] "Total asignado: 100% · ₲ X"
- [ ] "Adjuntar ticket"
- [ ] "Cancelar" / "Guardar gasto" / "Guardar cambios"
- [ ] "Eliminar gasto"

**Confirmaciones**
- [ ] "¿Seguro que querés eliminar..."
- [ ] "Esta acción no se puede deshacer."

**ExpenseRow / Lista**
- [ ] "Pagó Vos · ..." / "Pagó {Nombre} · ..."
- [ ] "Hoy · HH:mm" / "Ayer · HH:mm" / "DD MMM YYYY"

**Empty / states**
- [ ] "Todavía no hay gastos" (heredado Fase 2)
- [ ] "Cuando agregues un gasto aparecerá acá"

---

## Resolver discrepancias

- Trivial → fix in-place y re-validar
- Estructural / limitación → ADR en DECISIONS.md

## Validación

- ≥ 95% checks visuales
- 100% microcopy
- Discrepancias documentadas

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [03.06] 2026-MM-DD — Validación visual Fase 3
- ✅ Detalle Wallet con expenses: X/Y items
- ✅ Pantalla Agregar Gasto: X/Y items, microcopy 14/14
- ✅ Modo Edit: X/Y items
- 🧠 Desviaciones documentadas (si las hubo)
```

### Update `STATE.md`
- **Último módulo completado:** 03.06-validate-vs-mock
- **Próximo módulo a ejecutar:** prompts/03-fase-gastos/99-close-phase.md
