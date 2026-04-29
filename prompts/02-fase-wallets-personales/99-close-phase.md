# 99 — Cerrar Fase 2 (Wallets personales)

## Objetivo
Smoke test E2E final de Fase 2, commit de cierre, actualización de bitácora, plantilla de prompt para arrancar Fase 3 (Gastos).

## Pre-requisitos
- Módulos 02.01..02.06 completados

## Tareas

### 1. Smoke test E2E

Probar el flow completo en Expo Go con sesión real (no dummy):

1. **Login** con un user existente
2. ✅ Aterriza en Home con BottomNav, balance card, lista de wallets
3. **Tap FAB** → abre Crear Wallet (modal)
4. **Llenar form**: nombre "Test E2E", icon piggy, color #16A085, presupuesto +500k → tap Crear
5. ✅ Vuelve al Home, la wallet "Test E2E" aparece en la lista
6. **Tap la wallet recién creada** → abre Detalle con header gradient verde teal, métricas (500k presupuesto, 0 gastado, 500k restante), tabs visibles, empty state de gastos
7. **Back** → vuelve al Home
8. **Cambiar tab Profile** → ver botón Cerrar sesión
9. **Tap Cerrar sesión** → vuelve a `/login`
10. **Login otra vez** → la wallet "Test E2E" sigue ahí (persistencia)
11. **Force-quit + reabrir** → sigue logueado, lista cargada
12. **Cambiar tema OS a dark** → todas las pantallas adaptan
13. **(Opcional)** Insertar wallet desde Supabase Dashboard → si activaste realtime, aparece en la app sin reload
14. ✅ `npx tsc --noEmit` sin errores
15. ✅ No warnings críticos en consola Metro

### 2. Limpiar wallets de prueba

Opcional: borrar `Test E2E` desde Supabase Dashboard (o dejarla — sirve de seed).

### 3. Commit de cierre

```bash
cd f:/proyectos_2026/WallaTeam/WallaTeam
git status
git add -A
git commit -m "feat(wallets-personales): fase 2 - CRUD wallets personales con Home, Crear, Detalle

- BottomNav custom con FAB central elevado
- Wallet store Zustand + queries Supabase con cache + realtime opcional
- Pantalla Home con balance card gradient, quick actions, lista wallets, empty state
- Pantalla Crear Wallet con preview en vivo, picker icono/color, quick-add chips, opciones avanzadas
- Pantalla Detalle Wallet con header gradient, métricas, tabs, empty state de gastos
- Componentes nuevos: BottomNav, Avatar, IconBox, Chip, BalanceCard, QuickAction, WalletRow, SectionHeader, ToggleRow, Tabs, ProgressBar, Metric, EmptyExpenses
- Validación visual ≥95% vs prototipo HTML
- Microcopy 100% literal (es-PY)
- Realtime subscription al channel wallets-changes"
```

### 4. (Opcional) Push a remote
```bash
git push origin main
```

### 5. Actualizar bitácora

`bitacora/STATE.md`:
```markdown
**Última actualización:** 2026-MM-DD HH:MM (máquina: laptop-X)
**Fase activa:** 03-fase-gastos (pendiente de diseño de prompts)
**Último módulo completado:** 02.99-close-phase (Fase 2 cerrada ✅)
**Próximo módulo a ejecutar:** _diseñar prompts/03-fase-gastos/_
```

Snapshot global: marcar Fase 2 como ✅ Cerrada (6/6 módulos).

`bitacora/CHANGELOG.md`:
```markdown
## [02.99] 2026-MM-DD — Fase 2 (Wallets personales) cerrada ✅
- Smoke test E2E pasado en dispositivo real
- Commit `feat(wallets-personales): fase 2 - ...`
- Próxima fase: 03-fase-gastos (CRUD de expenses en wallet personal)
```

`bitacora/TASKS.md`:
- Mover toda sección "[Fase 2] ..." a Done
- Crear sección "[Fase 3] ..." en Pendiente

### 6. Plantilla de prompt para arrancar Fase 3

```
Empezá Fase 3 (Gastos) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Diseñá los prompts de prompts/03-fase-gastos/ siguiendo la plantilla
de Fase 2 (overview, módulos numerados, close-phase).

Mocks ground truth:
- design_handoff_wallateam_mvp/lib/screen-add-expense.jsx (form)
- design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx (sección "Lista de gastos")

Módulos sugeridos:
01 - Expense store + queries Supabase (CRUD expenses por wallet)
02 - ExpenseRow component + lista en Detalle Wallet (reemplaza EmptyExpenses)
03 - Pantalla Agregar Gasto (form + monto grande + categoría + fecha + paid_by + split_mode='equal' fijo Fase 3)
04 - Editar/eliminar gasto desde swipe o long-press
05 - Recalcular métricas en Detalle (gastado, restante, %, progress bar real)
06 - Validación visual + cierre

NOTA Fase 3: split_mode siempre 'equal' con un solo split (paid_by = user) — los splits multi-usuario son Fase 5.
Tampoco hay invitación de miembros — Fase 4. Lo de Fase 3 es: cargar gastos en wallets personales propias.

Recordá: actualizar bitácora al cerrar cada módulo, commit por módulo,
no inventar componentes (reusar Button/Input/IconBox/Chip etc.), microcopy literal.
```

## Validación

- ✅ Commit visible en `git log`
- ✅ `STATE.md` apunta a Fase 3
- ✅ `CHANGELOG.md` con entrada de cierre
- ✅ Working tree limpio (`git status`)

## Notas

Si algo falla en el smoke test, **no marcar fase como cerrada**. Volver al módulo correspondiente, fixear, re-validar. El close de fase es la garantía de calidad antes de avanzar.
