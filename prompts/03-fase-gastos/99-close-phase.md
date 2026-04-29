# 99 — Cerrar Fase 3 (Gastos)

## Objetivo
Smoke test E2E final, commit de cierre, actualización de bitácora, plantilla de prompt para Fase 4 (Equipo).

## Pre-requisitos
- Módulos 03.01..03.06 completados

## Tareas

### 1. Smoke test E2E

Probar el flow completo en Expo Go:

1. Login con user existente
2. Home → tap quick action **Gasto** → si tenés varias wallets, abre WalletPickerSheet → elegí una → abre Agregar Gasto con la wallet preseleccionada
3. Tipear monto `150000` → ver máscara `150.000` y chip "Guaraníes (PYG)"
4. Llenar descripción "Cena E2E", elegir categoría Comida
5. Verificar fecha = ahora con time
6. Verificar pagado por = vos (no editable)
7. Verificar sección "Cómo dividir" disabled con label "Fase 5"
8. Tap "Guardar gasto" → vuelve al Detalle
9. ✅ El gasto "Cena E2E" aparece **arriba** de la lista
10. ✅ Header recalculó: Gastado +150k, Restante = presupuesto-150k, % usado correcto
11. Volver al Home con back
12. ✅ BalanceCard muestra el balance neto (presupuesto total − todos los gastos)
13. Volver al Detalle, **tap** en el ExpenseRow → abre Editar gasto precargado
14. Cambiar monto a `200.000`, Guardar → Detalle muestra 200k restado
15. Volver al ExpenseRow, **long-press** → Alert con Editar/Eliminar → Eliminar → confirmación → desaparece y header se recalcula
16. Force-quit app y reabrir → datos persistidos, métricas correctas
17. (Opcional) Insertar gasto desde Supabase Dashboard → realtime trae a la app sin reload
18. `npx tsc --noEmit` sin errores
19. Sin warnings críticos en consola Metro

### 2. Limpiar gastos de prueba (opcional)
Borrar `Cena E2E` del dashboard si no querés mantenerlo.

### 3. Commit de cierre

```bash
cd f:/proyectos_2026/WallaTeam/WallaTeam
git status
git add -A
git commit -m "feat(gastos): fase 3 - CRUD de expenses con recálculo de métricas

- Expense store + RPC create_expense_with_split (atomic insert)
- ExpenseRow + lista en Detalle reemplaza EmptyExpenses
- Pantalla Agregar/Editar Gasto con AmountInput, FormRow, CategoryPicker, WalletPickerSheet
- Long-press y botón eliminar con confirmación
- useTotalBalance y useWalletMetrics recalculan con expenses reales (cierra ADR-009)
- Realtime subscription a expenses-changes
- Sección 'Cómo dividir' renderizada disabled hasta Fase 5
- Microcopy literal es-PY, validación zod"
```

### 4. (Opcional) Push a remote

```bash
git push origin main
```

### 5. Actualizar bitácora — cerrar fase

`bitacora/STATE.md`:

```markdown
**Última actualización:** 2026-MM-DD HH:MM (máquina: laptop-X)
**Fase activa:** 04-fase-equipo (pendiente de diseño de prompts)
**Último módulo completado:** 03.99-close-phase (Fase 3 cerrada ✅)
**Próximo módulo a ejecutar:** _diseñar prompts/04-fase-equipo/_
```

Snapshot global: marcar Fase 3 como ✅ Cerrada (7/7 módulos).

`bitacora/CHANGELOG.md` — append:

```markdown
## [03.99] 2026-MM-DD — Fase 3 (Gastos) cerrada ✅
- Smoke test E2E pasado (creación, edición, eliminación, recálculo)
- ADR-009 marcado como Resuelto
- Próxima fase: 04-fase-equipo (wallets type='team', invitaciones, miembros, RLS team)
```

`bitacora/TASKS.md`:
- Mover toda sección "[Fase 3] ..." a Done
- Crear sección "[Fase 4] ..." en Pendiente

### 6. Plantilla de prompt para arrancar Fase 4

```
Empezá Fase 4 (Equipo) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Diseñá los prompts de prompts/04-fase-equipo/ siguiendo la plantilla
de Fase 3 (overview, módulos numerados, close-phase).

Mocks ground truth:
- design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx (sección "Miembros" para type='team')
- design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx (avatares overlap, balance del grupo, tab Miembros)

Módulos sugeridos (revisar y ajustar):
01 - Habilitar type='team' en CreateWallet (sección Miembros + invite link UX)
02 - Tabla wallet_invites: store + queries (crear invite, generar invite_code, accept)
03 - Pantalla "Aceptar invitación" via deep link (wallateam://invite/CODE)
04 - Mostrar miembros en Detalle Wallet (avatares overlap + lista en tab Miembros)
05 - Habilitar paid_by selector en Agregar Gasto (selector entre miembros del wallet)
06 - Validación visual + cierre

NOTA Fase 4: NO incluye balance del grupo (deudas), eso es Fase 6.
SI incluye permitir crear gastos donde paid_by != user actual.

Recordá: actualizar bitácora al cerrar cada módulo, commit por módulo,
no inventar componentes (reusar Avatar/Chip/IconBox/etc.), microcopy literal.
```

## Validación

- ✅ Commit visible en `git log`
- ✅ `STATE.md` apunta a Fase 4
- ✅ `CHANGELOG.md` con entrada de cierre
- ✅ Working tree limpio

## Notas

Si algo falla en el smoke test, **no marcar fase como cerrada**. Volver al módulo correspondiente, fixear, re-validar.
