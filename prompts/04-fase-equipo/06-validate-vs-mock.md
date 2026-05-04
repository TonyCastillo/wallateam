# 04.06 — Validación visual contra prototipo (Fase 4)

## Objetivo
Comparar las pantallas nuevas o modificadas de Fase 4 contra el mock HTML. Match objetivo ≥95% visual + 100% microcopy.

## Pre-requisitos
- Módulos 04.01..04.05 cerrados
- Una wallet team con al menos 2 miembros creada

## Setup
- Prototype HTML: `WallaTeam Prototype.html` → tabs de Detalle Wallet y Crear Wallet
- Expo Go abierto en dispositivo/emulador

---

## Checklist Crear Wallet — sección Equipo

- [ ] Selector Personal/Equipo: ambos activos, Equipo seleccionable
- [ ] Al seleccionar Equipo: sección "Miembros" aparece con mensaje "Podés invitar miembros después de crear la wallet"
- [ ] Chip "Equipo" en header preview del wallet (en lugar de "Personal")
- [ ] Resto del form igual a Fase 3

---

## Checklist Detalle Wallet — wallet team

**Header**
- [ ] AvatarStack de miembros visible en titleRow
- [ ] Chip "Equipo" en lugar de "Personal"
- [ ] Métricas / ProgressBar sin cambios

**Tab Miembros**
- [ ] Lista de miembros con Avatar 40px + nombre + chip Owner/Miembro
- [ ] Botón "Invitar" visible
- [ ] Tap "Invitar" → genera invite → muestra sheet con link y botón "Copiar link"

---

## Checklist Agregar Gasto — wallet team

- [ ] Campo "PAGADO POR" tappable cuando wallet team con >1 miembro
- [ ] Sheet "¿Quién pagó?" con lista de miembros
- [ ] Seleccionar otro miembro → campo muestra su nombre + avatar
- [ ] Guardar → expense guardado con paid_by correcto

---

## Checklist Pantalla Aceptar Invitación

- [ ] Deep link `wallateam://invite/{code}` abre la pantalla
- [ ] Card con nombre + color + ícono de la wallet
- [ ] Texto "Fuiste invitado a unirte a esta wallet"
- [ ] Botón "Unirme al equipo" activo
- [ ] Error state para código inválido/expirado

---

## Microcopy (100% literal)

- [ ] `"Personal"` / `"Equipo"` (selector tipo)
- [ ] `"Podés invitar miembros después de crear la wallet"`
- [ ] `"Miembros"` (header del tab)
- [ ] `"Owner"` / `"Miembro"` (roles)
- [ ] `"Invitar"`
- [ ] `"Compartí este link para invitar"`
- [ ] `"Copiar link"` / `"Link copiado al portapapeles"`
- [ ] `"Fuiste invitado a unirte a esta wallet"`
- [ ] `"Unirme al equipo"`
- [ ] `"¿Quién pagó?"`

---

## Cierre

```markdown
## [04.06] YYYY-MM-DD — Validación visual Fase 4
- ✅ CreateWallet team: X/Y items
- ✅ Detalle Wallet team (header, tab Miembros, invite): X/Y items
- ✅ Agregar Gasto paid_by: X/Y items
- ✅ Pantalla invitación: X/Y items
- ✅ Microcopy: X/10 literal
- 🧠 Desviaciones: (si las hubo)
```
