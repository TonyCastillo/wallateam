# 99 — Cerrar Fase 4 (Equipo)

## Objetivo
Smoke test E2E final del flujo team completo, commit de cierre, actualización de bitácora, plantilla de prompt para Fase 5 (Splits).

## Pre-requisitos
- Módulos 04.01..04.06 completados

## Tareas

### 1. Smoke test E2E

1. Login con user A
2. Crear wallet "Viaje a Brasil" tipo Equipo → aparece en Home con chip "Equipo"
3. Ir al Detalle → tab Miembros → tap "Invitar" → copiar el link
4. En otro dispositivo/emulador con user B: abrir `wallateam://invite/{code}`
5. User B ve la pantalla de invitación → tap "Unirme al equipo"
6. Volver al Detalle con user A: AvatarStack ahora muestra 2 avatares, tab Miembros lista a ambos
7. User A agrega un gasto → campo "PAGADO POR" tappable → seleccionar user B → guardar
8. Verificar en Supabase: `paid_by = user_B.id`
9. Force-quit y reabrir → datos persistidos
10. `npx tsc --noEmit` sin errores
11. Sin warnings críticos en consola Metro

### 2. Commit de cierre

```bash
git add -A
git commit -m "feat(equipo): fase 4 - wallets team, invitaciones, miembros, paid_by selector

- type='team' habilitado en CreateWallet con auto-insert owner en wallet_members
- store useInvites con create/accept/revoke y invite_code generado localmente
- Deep link wallateam://invite/[code] para aceptar invitaciones
- AvatarStack en header del Detalle + tab Miembros con lista y botón Invitar
- paid_by selector tappable en Agregar Gasto para wallets team con >1 miembro
- Componentes: AvatarStack, MemberPickerSheet"
```

### 3. Actualizar bitácora

`bitacora/STATE.md`:
- Fase activa: `05-fase-splits`
- Último completado: `04.99-close-phase (Fase 4 cerrada ✅)`
- Próximo: `prompts/05-fase-splits/`
- Snapshot: Fase 4 → ✅ Cerrada (7/7)

`bitacora/CHANGELOG.md` — append:
```markdown
## [04.99] YYYY-MM-DD — Fase 4 (Equipo) cerrada ✅
- Smoke test E2E: creación wallet team, invitación, aceptación, paid_by por otro miembro
- Próxima fase: 05-fase-splits (=, %, ₲ con validaciones)
```

`bitacora/TASKS.md`:
- Mover todos los `[Fase 4]` a Done
- La sección `[Fase 5]` ya está en Pendiente (verificar)

### 4. Plantilla para Fase 5

```
Empezá Fase 5 (Splits) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Diseñá los prompts de prompts/05-fase-splits/ siguiendo la plantilla de Fase 4.

Objetivo Fase 5: habilitar la sección "Cómo dividir" en Agregar Gasto (actualmente
disabled con opacity 0.6 y label "Fase 5"). Tres modos: igual (=), porcentaje (%),
monto fijo (₲). Validar que la suma de splits == monto total.

Mocks ground truth:
- design_handoff_wallateam_mvp/lib/screen-expense-new.jsx (sección splits activa)

Recordá: actualizar bitácora al cerrar cada módulo, microcopy literal es-PY.
```

## Validación
- ✅ Commit en `git log`
- ✅ `STATE.md` apunta a Fase 5
- ✅ Working tree limpio
