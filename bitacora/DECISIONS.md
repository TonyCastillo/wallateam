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

> Las siguientes ADRs se irán agregando a medida que se tomen decisiones durante la ejecución de las fases. Ejemplos de qué documentar:
> - Desviaciones visuales del prototipo por limitaciones de RN
> - Cambios en el modelo SQL respecto al README original
> - Adopción de librerías no incluidas en el stack inicial
> - Estrategias de caching, sync offline, etc.
