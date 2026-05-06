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
- `STATE.md`: Fase activa → 07-fase-multimoneda. Próximo módulo → diseñar prompt-pack 07.
- `CHANGELOG.md`: entry `[06.99]` consolidando lo de la fase.
- `TASKS.md`: mover Fase 6 a Done, agregar item Fase 7 a Pendiente.
- `DECISIONS.md`: ADR-015 (kind='settlement') si no se agregó en 06.04.

### 4. Plantilla para Fase 7
```
Empezá Fase 7 (Multimoneda) del proyecto WallaTeam.

Lectura obligatoria:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Objetivo Fase 7: Soportar wallets en USD y ARS además de PYG.
Conversión a moneda principal del usuario al mostrar totales agregados
(BalanceCard, useTotalBalance). Tabla currencies ya existe en schema.sql.

Mocks ground truth:
- Sin mock específico — diseñar componentes nuevos siguiendo design system.
```

## Validación
- ✅ Commit en `git log`
- ✅ `STATE.md` apunta a Fase 7
- ✅ Working tree limpio
