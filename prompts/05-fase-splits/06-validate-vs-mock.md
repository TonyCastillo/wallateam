# 05.06 — Validación visual contra prototipo (Fase 5)

## Objetivo
Comparar la sección de "Cómo dividir" implementada contra el mock JSX. Match objetivo ≥95% visual + 100% microcopy.

## Pre-requisitos
- Módulos 05.01..05.05 cerrados
- Una wallet team con >1 miembro creada
- Expo Go abierto en dispositivo/emulador

## Checklist Agregar Gasto — Sección "Cómo dividir"
- [ ] Oculta en wallets personales o en ingresos (kind='income')
- [ ] Toggle "=", "%", "₲" visible y funcional
- [ ] Al seleccionar "=" el subtítulo dice "Por partes iguales"
- [ ] Al seleccionar "%" el subtítulo dice "Por porcentajes personalizados"
- [ ] Al seleccionar "₲" el subtítulo dice "Por montos fijos"

## Checklist Componente SplitRow
- [ ] Renderiza Avatar, nombre y layout según `screen-add-expense.jsx`
- [ ] La barra de porcentaje debajo del nombre usa un gradiente de primary a accent y su `width` se adapta al porcentaje.
- [ ] Microcopy "%" literal en el layout
- [ ] Monto formateado con `fmtGs` según lo establecido en ADR-012.

## Checklist Validación
- [ ] Total asignado footer: "Total asignado" (label), "100% · ₲ X.XXX" (valor)
- [ ] Botón de guardar deshabilitado si la suma no es perfecta en los modos manuales.

## Cierre
```markdown
## [05.06] YYYY-MM-DD — Validación visual Fase 5
- ✅ Toggle de modos: X/Y items
- ✅ SplitRow: X/Y items
- ✅ Validaciones footer: X/Y items
- 🧠 Desviaciones: (si las hubo)
```
