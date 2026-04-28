# Estado actual del proyecto WallaTeam

**Última actualización:** 2026-04-28 (máquina: laptop-casa)
**Fase activa:** 01-fase-auth
**Último módulo completado:** 01.04-supabase-client
**Próximo módulo a ejecutar:** [prompts/01-fase-auth/05-screen-login.md](../prompts/01-fase-auth/05-screen-login.md)

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
| 01 — Auth | 🟡 En curso | 4 / 7 |
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
- Inter cargado vía `@expo-google-fonts/inter` con splash screen hasta listo
- Helper `theme/typography.ts` expone `text.{regular,medium,semibold,bold}` y `fontFamily(weight)`
- Supabase project `azfcmdihftxtiwrvcfsh` activo. Schema (7 tablas + 4 currencies seed + trigger handle_new_user) y RLS aplicados en dashboard. Confirm email desactivado en dev (ADR-007).
- Cliente Supabase listo en `app/lib/supabase.ts` con AsyncStorage adapter; helpers PYG en `app/lib/format.ts`
- Smoke test contra REST API: `currencies` devuelve [ARS, EUR, PYG, USD] correctamente
- Próxima acción: ejecutar `prompts/01-fase-auth/05-screen-login.md` (UI de Login/Registro + auth gate)

## Comandos útiles

```bash
cd app
npm install --legacy-peer-deps   # primera vez en cada máquina (o tras cambios en package.json)
npm start                         # arranca expo dev server
npm run typecheck                 # tsc --noEmit
```

## Blocker

_(ninguno activo)_
