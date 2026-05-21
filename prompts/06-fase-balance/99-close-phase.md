# 06.99 — Cerrar Fase 6 (Balance del grupo)

## Objetivo
Smoke test E2E final, commit de cierre, actualización de bitácora, plantilla para Fase 7 (Multimoneda).

## Tareas

### 1. Smoke test E2E (3 cuentas / dispositivos)
1. Cuenta A crea wallet team "Viaje", invita a B y C, ambos aceptan.
2. A registra gasto ₲ 90.000 split equal entre los 3 (30k c/u). B registra ₲ 60.000 split equal (20k c/u). C registra ₲ 30.000 split equal (10k c/u).
3. Saldos esperados:
   - A: pagó 90k, consumió 60k → +30k
   - B: pagó 60k, consumió 60k → 0
   - C: pagó 30k, consumió 60k → −30k
4. Tab Resumen en cuenta C: ver "TU SALDO −₲ 30.000 debés" + lista + 1 sola transferencia "C → A: ₲ 30.000".
5. Cuenta C tap "Marcar como saldado" → confirmar ₲ 30.000 → la transferencia desaparece, todos quedan en 0.
6. Tab Resumen ahora muestra empty state "¡Todo saldado!".
7. Tab Gastos NO muestra la settlement como un gasto regular.
8. `npm run typecheck` limpio.

### 2. Commit de cierre
```bash
git add -A
git commit -m "chore(balance)[06.99]: cerrar Fase 6

- algoritmo computeNets + simplifyDebts (greedy)
- hook useBalance con fetch de splits
- tab Resumen con balance del grupo (solo team)
- saldar flow con kind='settlement'
- empty states + microcopy literal es-PY"
```

### 3. Actualizar bitácora
- `STATE.md`: Fase activa → 08-fase-extras. Próximo módulo → `prompts/08-fase-extras/00-overview.md` (luego 01-storage-bucket).
- `CHANGELOG.md`: entry `[06.99]` consolidando lo de la fase.
- `TASKS.md`: mover Fase 6 a Done, agregar ítems de Fase 8 a Pendiente.
- `DECISIONS.md`: ADR-015 (kind='settlement') si no se agregó en 06.04.

> **Nota:** Fase 7 (Multimoneda) quedó **diferida indefinidamente** (decisión 2026-05-20 — MVP es PYG-only para lanzamiento en Paraguay). Ver `prompts/07-fase-multimoneda/DEFERRED.md`. Saltamos directamente de Fase 6 a Fase 8.

### 4. Plantilla para Fase 8
```
Empezá Fase 8 (Extras) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md
4. prompts/08-fase-extras/00-overview.md

Objetivo Fase 8: dos features grandes:
1. Foto del ticket — adjuntar imagen a un gasto vía cámara/galería con
   upload a Supabase Storage. Columna expenses.photo_url ya existe.
2. Charts mensuales — visualización de gastos por mes y por categoría
   en el tab Resumen del Wallet Detail personal (hoy es placeholder).

Fase 7 (Multimoneda) está deferred — no ejecutarla.

Mocks ground truth:
- Sin mock específico para foto/charts. Diseñar siguiendo design system.
```

## Validación
- ✅ Commit en `git log`
- ✅ `STATE.md` apunta a Fase 7
- ✅ Working tree limpio
