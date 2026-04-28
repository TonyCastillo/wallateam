# Estado actual del proyecto WallaTeam

**Última actualización:** 2026-04-28 (máquina: laptop-casa)
**Fase activa:** 01-fase-auth
**Último módulo completado:** 01.02-theme-tokens
**Próximo módulo a ejecutar:** [prompts/01-fase-auth/03-fonts-inter.md](../prompts/01-fase-auth/03-fonts-inter.md)

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
| 01 — Auth | 🟡 En curso | 2 / 7 |
| 02 — Wallets personales | ⚪ Pendiente | — |
| 03 — Gastos | ⚪ Pendiente | — |
| 04 — Equipo | ⚪ Pendiente | — |
| 05 — Splits | ⚪ Pendiente | — |
| 06 — Balance | ⚪ Pendiente | — |
| 07 — Multimoneda | ⚪ Pendiente | — |
| 08 — Extras | ⚪ Pendiente | — |

## Notas del momento

- Expo SDK 54 (más nuevo que SDK 50 mínimo) — React 19.1, RN 0.81.5
- Todas las dependencias del MVP instaladas en `app/package.json`
- Para nuevas instalaciones de paquetes, recordar usar `--legacy-peer-deps` (ver ADR-004)
- `npx expo start` arranca correctamente en `localhost:8081`
- TypeScript strict habilitado, type-check limpio
- Theme tokens light/dark + ThemeProvider listos. Persisten preferencia en AsyncStorage.
- `Colors` type relajado a `string` (en vez de literals) para que `colorsDark` encaje (ver ADR-006)
- Próxima acción: ejecutar `prompts/01-fase-auth/03-fonts-inter.md` (carga de fuentes Inter)

## Comandos útiles

```bash
cd app
npm install --legacy-peer-deps   # primera vez en cada máquina (o tras cambios en package.json)
npm start                         # arranca expo dev server
npm run typecheck                 # tsc --noEmit
```

## Blocker

_(ninguno activo)_
