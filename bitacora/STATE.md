# Estado actual del proyecto WallaTeam

**Última actualización:** 2026-04-29 (máquina: antigravity)
**Fase activa:** 03-fase-gastos
**Último módulo completado:** 03.01-expense-store
**Próximo módulo a ejecutar:** [prompts/03-fase-gastos/02-expense-row-list.md](../prompts/03-fase-gastos/02-expense-row-list.md)

---

## Para retomar (desde cualquier máquina o agente nuevo)

1. Leer [`prompts/00-AGENT-HANDOFF.md`](../prompts/00-AGENT-HANDOFF.md)
2. Leer [`prompts/00-MASTER.md`](../prompts/00-MASTER.md)
3. Leer este archivo (ya lo estás haciendo)
4. Leer [`bitacora/CHANGELOG.md`](CHANGELOG.md) (historial)
5. Leer [`bitacora/TASKS.md`](TASKS.md) (qué está en curso/pendiente)
6. Leer [`bitacora/DECISIONS.md`](DECISIONS.md) (ADRs)
7. Abrir el archivo apuntado por **Próximo módulo a ejecutar** y ejecutarlo
8. Al terminar el módulo, actualizar este archivo + CHANGELOG + TASKS

## Snapshot del progreso global

| Fase | Estado | Módulos done |
|---|---|---|
| 01 — Auth | ✅ Cerrada | 7 / 7 |
| 02 — Wallets personales | ✅ Cerrada (validación visual diferida) | 7 / 7 |
| 03 — Gastos | 🟡 En curso | 1 / 7 |
| 04 — Equipo | ⚪ Pendiente | — |
| 05 — Splits | ⚪ Pendiente | — |
| 06 — Balance | ⚪ Pendiente | — |
| 07 — Multimoneda | ⚪ Pendiente | — |
| 08 — Extras | ⚪ Pendiente | — |

## Notas del momento

- **Fase 1 (Auth) completa**: setup Expo SDK 54, theme tokens light/dark, fuentes Inter, Supabase project + schema + RLS, Login/Registro funcional con sesión persistente
- Project Supabase activo: `azfcmdihftxtiwrvcfsh.supabase.co`
- Confirm email **OFF en dev** (re-activar antes de release a prod)
- Stack en producción: Expo SDK 54 + React 19.1 + RN 0.81.5
- 9 commits en main: bootstrap → 01.01..01.05 → cierre Fase 1 → prompt-pack Fase 2
- **Prompt-pack Fase 2 escrito** (`prompts/02-fase-wallets-personales/00..99` listos)
- **Pantalla Detalle de Wallet** implementada en `app/(app)/wallet/[id].tsx`: header gradient (color wallet → secondary), métricas (Presupuesto/Gastado/Restante), progress bar, tabs underline (Gastos activo, Resumen y Miembros con placeholders), EmptyExpenses, FAB de "agregar gasto" (Alert por ahora — Fase 3 lo wirea).
- Métricas usan `gastado=0` y `restante=initial_balance` mientras Fase 3 no calcule sumatoria de expenses (consistente con ADR-009).
- **Próxima acción:** ejecutar [`prompts/02-fase-wallets-personales/06-validate-vs-mock.md`](../prompts/02-fase-wallets-personales/06-validate-vs-mock.md) — checklist visual de las 3 pantallas (Home / Crear / Detalle) contra el prototipo HTML.

## Plantilla para arrancar Fase 2

Pegar este prompt al usuario o al próximo agente cuando se vaya a iniciar Fase 2:

```
Empezá Fase 2 (Wallets personales) del proyecto WallaTeam.

Lectura obligatoria antes de cualquier acción:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Después:
- Crear los archivos de prompts/02-fase-wallets-personales/ siguiendo
  la estructura de prompts/01-fase-auth/ (00-overview, 01..N módulos, 99-close-phase)
- Mocks ground truth: design_handoff_wallateam_mvp/lib/screen-home.jsx,
  screen-create-wallet.jsx, screen-wallet-detail.jsx (este último mostrará data
  dummy hasta Fase 4)
- Módulos sugeridos:
  01 - BottomNav component + (app)/(tabs) layout
  02 - Wallet store + queries Supabase (CRUD wallets personales)
  03 - Pantalla Home (balance card gradient, quick actions, lista wallets)
  04 - Pantalla Crear Wallet (form completo SIN sección team que va Fase 4)
  05 - Pantalla Detalle Wallet (sin gastos reales, placeholder lista)
  06 - Validación visual contra prototipo
  99 - Cerrar fase

Recordá: actualizar bitácora al cerrar cada módulo, commit por módulo,
no inventar componentes (reusar Icon/Button/Input/Theme), microcopy literal es-PY.
```

## Comandos útiles

```bash
cd app
npm install --legacy-peer-deps   # primera vez en cada máquina o tras package.json change
npm start                         # Metro dev server
npm run typecheck                 # tsc --noEmit
```

## Blocker

_(ninguno activo)_
