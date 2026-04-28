# DECISIONS — WallaTeam (ADRs)

> Decisiones arquitectónicas no obvias. Formato breve: contexto, decisión, consecuencias.
> Las obvias o triviales NO van acá (ej. "usamos TypeScript" — eso es obvio del stack).

---

## ADR-001 · Sibling folder `app/` paralelo al handoff

**Fecha:** 2026-04-28
**Contexto:** El handoff existente vive en `design_handoff_wallateam_mvp/` y queremos mantenerlo intocable como ground truth visual.
**Decisión:** El proyecto Expo va en `WallaTeam/app/` paralelo al handoff. El handoff queda read-only.
**Consecuencias:** Los prompts referencian al handoff con paths relativos `../../design_handoff_wallateam_mvp/...`. El git root es `WallaTeam/`.

## ADR-002 · StyleSheet + tokens centralizados (no NativeWind)

**Fecha:** 2026-04-28
**Contexto:** El README sugería NativeWind o StyleSheet. El diseño usa gradientes radiales y lineales muy específicos + dark mode con paleta dual + componentes con shadows complejas.
**Decisión:** `StyleSheet.create` + `theme/tokens.ts` con un `ThemeProvider` y hook `useTheme()`.
**Consecuencias:** Más verboso en estilos pero control 100% sobre dark mode dinámico, gradientes (`expo-linear-gradient` + `react-native-svg` para radiales), y sombras nativas. Sin build step adicional.

## ADR-003 · Supabase project creado en Fase 1

**Fecha:** 2026-04-28
**Contexto:** El módulo `04-supabase-client.md` requiere project Supabase activo.
**Decisión:** Crear project en Fase 1.04, region más cercana al usuario (sa-east-1 si disponible). Schema y RLS se aplican desde el SQL editor del dashboard.
**Consecuencias:** Las credenciales viven en `app/.env` (no commiteado). Para sync entre máquinas, copiar `.env` por canal seguro o reconstruir desde dashboard.

---

## ADR-004 · `npm install --legacy-peer-deps` para deps JS sobre Expo SDK 54

**Fecha:** 2026-04-28
**Contexto:** Expo SDK 54 trae `react@19.1.0`, pero `expo-router@6` arrastra `react-dom@19.2.5` que pide `react@^19.2.5` como peer estricto. npm 11 falla con ERESOLVE al instalar paquetes JS adicionales (supabase-js, zustand, etc.).
**Decisión:** Usar `npm install --legacy-peer-deps` para los paquetes pure-JS. Los paquetes nativos van con `npx expo install` (que ya resuelve compatibilidad correctamente).
**Consecuencias:**
- Workaround estándar y documentado para Expo + React 19 mientras Expo no actualice React 19.2.x
- Cualquier nueva instalación posterior debe usar el flag (anotado en `STATE.md` sección "Comandos útiles")
- Si en futuro Expo bumpea React a 19.2+, este flag puede dejar de ser necesario

## ADR-006 · `Colors` type relajado a `string` para soportar dual palette

**Fecha:** 2026-04-28
**Contexto:** En `theme/tokens.ts`, definir `colors as const` produce literal types (`primary: '#16A085'`). Con `export type Colors = typeof colors`, asignar `colorsDark` (que tiene otros hex literales) al `Theme.colors: Colors` falla en TS strict porque `'#5DA9E9'` no es asignable a `'#1F3A5F'`.
**Decisión:** Definir `Colors` como `{ readonly [K in keyof typeof colors]: string }` — mantiene la forma estructural y los keys, pero relaja los valores a `string`.
**Consecuencias:**
- El `as const` se mantiene en los objetos para preservar forma e intellisense
- `Theme.colors` puede ser tanto `colors` (light) como `colorsDark` sin coerción
- Si se quisieran literal types en consumidores específicos, importar `colors`/`colorsDark` directamente, no a través de `Theme.colors`

## ADR-005 · Expo SDK 54 (no SDK 50)

**Fecha:** 2026-04-28
**Contexto:** El README handoff sugería SDK 50+. `create-expo-app@latest` instaló SDK 54.
**Decisión:** Aceptar SDK 54 (más reciente, soportado, con New Architecture habilitada por default).
**Consecuencias:**
- React 19 + RN 0.81 (mejoras de perf y APIs más modernas)
- New Architecture activa (`newArchEnabled: true`) — todas las libs nativas instaladas son compatibles
- El prompt `01-setup-expo.md` original mencionaba SDK 50+, por lo que SDK 54 cumple el contrato

---

> Las siguientes ADRs se irán agregando a medida que se tomen decisiones durante la ejecución de las fases.
