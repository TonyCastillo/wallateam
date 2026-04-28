# WallaTeam

> App móvil de gastos compartidos en grupo (familias, parejas, equipos). MVP en React Native + Expo + Supabase.
>
> _Gastos compartidos, sin enredos. Tu billetera en equipo._

---

## Estructura del repo

```
WallaTeam/
├── design_handoff_wallateam_mvp/   ← Handoff de diseño (READ-ONLY)
│                                     mocks JSX, branding, prototype HTML
├── prompts/                         ← Prompts ejecutables por fase
│   ├── 00-MASTER.md                 ← Contexto global (leer siempre)
│   ├── 00-AGENT-HANDOFF.md          ← Cómo retomar el proyecto
│   └── 0N-fase-X/                   ← Prompts numerados por fase
├── bitacora/                        ← Estado vivo del proyecto
│   ├── STATE.md                     ← Snapshot actual (qué sigue)
│   ├── CHANGELOG.md                 ← Historial append-only
│   ├── TASKS.md                     ← Backlog vivo
│   └── DECISIONS.md                 ← ADRs no obvios
└── app/                             ← Proyecto Expo RN (creado en Fase 1.01)
```

## Cómo arrancar (primera vez)

1. Leer en este orden:
   - [`prompts/00-AGENT-HANDOFF.md`](prompts/00-AGENT-HANDOFF.md)
   - [`prompts/00-MASTER.md`](prompts/00-MASTER.md)
   - [`bitacora/STATE.md`](bitacora/STATE.md)
2. `STATE.md` te dice cuál es el **próximo módulo a ejecutar**
3. Abrir ese archivo y seguir sus tareas paso a paso
4. Al terminar el módulo, actualizar la bitácora antes de detenerte

## Cómo retomar desde otra máquina

```bash
git clone <tu-remote>/WallaTeam.git
cd WallaTeam
git pull
```

- `app/.env` no está en git (contiene secrets de Supabase). Copiarlo manualmente o reconstruir desde el dashboard de Supabase.
- En `app/` correr `npm install` la primera vez en cada máquina.
- Después seguir el flujo "Cómo arrancar (primera vez)" — la bitácora te dice exactamente desde dónde retomar.

## Roadmap por fases

| # | Fase | Estado |
|---|---|---|
| 01 | Auth (login, signup, sesión persistente) | Definido (prompts listos) |
| 02 | Wallets personales (Home, Crear, Detalle) | A planificar al cerrar 01 |
| 03 | Gastos | Pendiente |
| 04 | Equipo (wallets type='team', invites, RLS) | Pendiente |
| 05 | Splits (=, %, ₲) | Pendiente |
| 06 | Balance (cálculo de deudas, saldar) | Pendiente |
| 07 | Multimoneda (USD, ARS, conversión) | Pendiente |
| 08 | Extras (foto ticket, push, charts) | Pendiente |

Detalle del alcance: [`prompts/00-MASTER.md`](prompts/00-MASTER.md) sección 9.

## Stack

- Expo SDK 50+ + TypeScript strict + expo-router
- Zustand (estado) + react-hook-form + zod (forms)
- Supabase (Auth + Postgres + RLS + Realtime)
- StyleSheet + tokens centralizados (`theme/tokens.ts`)
- Inter (`@expo-google-fonts/inter`) + lucide-react-native
- expo-linear-gradient + react-native-svg

## Reglas no negociables (resumen)

- **No modificar** `design_handoff_wallateam_mvp/` (es ground truth)
- **Antes de cualquier acción**, leer `bitacora/STATE.md`
- **Al cerrar cada módulo**, actualizar `STATE.md` + `CHANGELOG.md` + `TASKS.md`
- **Al cerrar fase**, ejecutar el `99-close-phase.md` y commit
- **Microcopy literal** (es-PY tuteo paraguayo) — no traducir, no parafrasear
- **Validación visual** contra `WallaTeam Prototype.html` antes de marcar UI como done

## Recursos del handoff

- [`design_handoff_wallateam_mvp/README.md`](design_handoff_wallateam_mvp/README.md) — overview, modelo SQL, tokens
- [`design_handoff_wallateam_mvp/WallaTeam Prototype.html`](design_handoff_wallateam_mvp/WallaTeam%20Prototype.html) — prototipo navegable (abrir en browser)
- [`design_handoff_wallateam_mvp/lib/`](design_handoff_wallateam_mvp/lib/) — mocks JSX por pantalla
- [`design_handoff_wallateam_mvp/branding/`](design_handoff_wallateam_mvp/branding/) — guía de marca + design system
