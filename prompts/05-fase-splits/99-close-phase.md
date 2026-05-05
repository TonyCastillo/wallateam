# 99 — Cerrar Fase 5 (Splits)

## Objetivo
Smoke test E2E final, commit de cierre, actualización de bitácora, y plantilla para Fase 6 (Balance del grupo).

## Tareas

### 1. Smoke test E2E
1. En wallet "Equipo", ingresar gasto de ₲ 90.000.
2. Dividir = entre 3 personas (33.33% / 30.000 c/u) → Guardar.
3. Verificar en base de datos (`expense_splits`) que se insertaron 3 filas correctamente.
4. Editar ese gasto y pasarlo a % (50%, 25%, 25%) → Guardar.
5. Verificar DB actualizada.
6. Editar a modo ₲ (40.000, 40.000, 10.000) → Guardar.
7. Verificar DB actualizada.
8. `npx tsc --noEmit` limpio.

### 2. Commit de cierre
```bash
git add -A
git commit -m "feat(splits): fase 5 - division por igual, porcentaje y montos fijos

- store/schema soportan array de splits con validaciones en UI
- UI toggle para modos =, %, ₲ en Agregar Gasto
- componente SplitRow interactivo con barra de porcentaje
- validacion strict de sumas y bloqueo de guardado"
```

### 3. Actualizar bitácora
Actualizar `STATE.md`, `CHANGELOG.md`, `TASKS.md` moviendo Fase 5 a Done e iniciando Fase 6.

### 4. Plantilla para Fase 6
```
Empezá Fase 6 (Balance del grupo) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Diseñá los prompts de prompts/06-fase-balance/ siguiendo la plantilla de Fase 4 y 5.

Objetivo Fase 6: Habilitar la visualización de "Quién debe a quién" en el Detalle
de Wallet Team. Implementar un algoritmo de simplificación de deudas (minimizar transacciones)
basado en los saldos netos de cada miembro.

Mocks ground truth:
- design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx (sección "Balance del grupo")
```

## Validación
- ✅ Commit en `git log`
- ✅ `STATE.md` apunta a Fase 6
- ✅ Working tree limpio
