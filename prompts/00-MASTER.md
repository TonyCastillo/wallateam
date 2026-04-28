# 00 — MASTER PROMPT (WallaTeam MVP)

> Este archivo es el **contexto global** que cualquier agente debe asumir al ejecutar cualquier prompt de cualquier fase. Léelo entero antes de actuar. Si te quedaste sin tokens o sos un agente nuevo, complementalo con `00-AGENT-HANDOFF.md`.

---

## 1. Identidad del proyecto

- **Nombre:** WallaTeam
- **Slogan:** _Gastos compartidos, sin enredos. Tu billetera en equipo._
- **Concepto:** App móvil de gestión de gastos compartidos en grupo (familias, parejas, amigos, equipos). Eje central: **Wallets** personales o de equipo donde se cargan gastos y se dividen entre miembros.
- **Locale primario:** `es-PY` (español Paraguay, tuteo paraguayo: "Invitá", "Ingresá", "Tenés")
- **Moneda default:** PYG (guaraníes), arquitectura multi-moneda desde día 1 (`currency_code` en wallets).

## 2. Stack confirmado (no negociable salvo aprobación explícita)

| Área | Decisión |
|---|---|
| Framework | **Expo SDK 50+** (managed workflow) |
| Lenguaje | **TypeScript strict** |
| Navegación | **expo-router** (file-based, grupos `(auth)` y `(app)`) |
| Estado | **Zustand** + persist a `AsyncStorage` |
| Backend | **Supabase** (Auth + Postgres + RLS + realtime) |
| Styling | **`StyleSheet.create` + tokens centralizados** (no NativeWind) |
| Íconos | **`lucide-react-native`** (strokeWidth=1.8) |
| Tipografía | **Inter** vía `@expo-google-fonts/inter` (400/500/600/700) |
| SVG | **`react-native-svg`** (logo, gradientes radiales) |
| Gradientes | **`expo-linear-gradient`** (lineales) + `react-native-svg` (radiales) |
| Forms | **`react-hook-form`** + **`zod`** + `@hookform/resolvers` |
| Moneda | `Intl.NumberFormat('es-PY')` + helper `fmtGs` |
| i18n | `i18n-js` (default `es-PY`) — diferido a Fase 7 |

## 3. Paths críticos del workspace

```
f:\proyectos_2026\WallaTeam\WallaTeam\
├── design_handoff_wallateam_mvp/   ← READ-ONLY: mocks JSX, branding, prototype HTML
├── prompts/                         ← este pack (prompts ejecutables por fase)
├── bitacora/                        ← STATE / CHANGELOG / TASKS / DECISIONS
└── app/                             ← proyecto Expo RN (creado en Fase 1)
```

**Mocks de referencia (ground truth visual):**
- `design_handoff_wallateam_mvp/lib/screen-login.jsx` — Fase 1
- `design_handoff_wallateam_mvp/lib/screen-home.jsx` — Fase 2
- `design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx` — Fase 2
- `design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx` — Fases 4-6
- `design_handoff_wallateam_mvp/lib/screen-add-expense.jsx` — Fases 3, 5
- `design_handoff_wallateam_mvp/lib/wallateam-ui.jsx` — primitives (Icon, WTLogo, WTBottomNav, WT_THEMES, WT_FONT)
- `design_handoff_wallateam_mvp/WallaTeam Prototype.html` — abrir en browser para validar visualmente

**Spec:**
- `design_handoff_wallateam_mvp/README.md` — overview, modelo SQL, tokens
- `design_handoff_wallateam_mvp/branding/walla_team_branding_guide.md` — guía de marca
- `design_handoff_wallateam_mvp/branding/walla_team_design_system.md` — tokens en formato RN

## 4. Design tokens (fuente de verdad — copiar al carácter)

### Colors light

```ts
export const colors = {
  primary:        '#16A085',
  primaryDark:    '#138D75',
  secondary:      '#1F3A5F',
  accent:         '#2ECC71',
  background:     '#FFFFFF',
  surface:        '#F8F9FA',
  surfaceAlt:     '#F1F4F6',
  textPrimary:    '#2C3E50',
  textSecondary:  '#7F8C8D',
  border:         '#E5E7EB',
  danger:         '#E74C3C',
  warning:        '#F39C12',
  success:        '#2ECC71',
  chipBg:         'rgba(22,160,133,0.10)',
  chipBgBlue:     'rgba(31,58,95,0.08)',
};
```

### Colors dark

```ts
export const colorsDark = {
  background:    '#0E1B2C',
  surface:       '#15263C',
  surfaceAlt:    '#1B2E47',
  border:        '#243B58',
  textPrimary:   '#ECF0F1',
  textSecondary: '#9AA8B6',
  primary:       '#16A085',
  secondary:     '#5DA9E9',  // ← cambia respecto a light
  accent:        '#2ECC71',
  danger:        '#FF6B5B',
  warning:       '#F39C12',
  chipBg:        'rgba(46,204,113,0.14)',
  chipBgBlue:    'rgba(93,169,233,0.16)',
};
```

### Typography

- **Familia:** Inter (Google Fonts vía `@expo-google-fonts/inter`)
- **Pesos:** `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`, `Inter_700Bold`
- **Sizes:** xs=12, sm=14, base=16, lg=18, xl=22, 2xl=28, 3xl=36
- **Line heights:** sm=18, base=22, lg=26

### Spacing & radius

```ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius  = { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 };
```

### Shadows

```ts
export const shadows = {
  card: {
    shadowColor: '#1F3A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHi: {
    shadowColor: '#1F3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};
```

### Gradientes principales

- **CTA primary:** `linear-gradient(135deg, #16A085 0%, #1F3A5F 120%)` — usar `expo-linear-gradient` con `colors={['#16A085', '#1F3A5F']}`, `locations={[0, 1]}`, `start={{x:0,y:0}}, end={{x:1,y:1}}` (aprox 135°)
- **Hero radial (login):** `radial-gradient(60% 60% at 50% 40%, #16A08533 0%, transparent 70%)` — implementar con `<Svg><Defs><RadialGradient/></Defs><Rect/></Svg>` de `react-native-svg`
- **Header wallet detail:** gradient de secondary→primary
- **Sombra del CTA:** `shadowColor: '#16A085', shadowOpacity: 0.30, shadowRadius: 16, shadowOffset: {width:0, height:6}`

## 5. Reglas de moneda PYG

- Símbolo: `₲` (no `Gs`, no `$`)
- Separador miles: `.` (punto)
- **Sin decimales** para PYG
- Negativos: prefijo `−` (minus signo Unicode `U+2212`, NO guion ASCII `-`), color `danger`
- Positivos en signed contexts: prefijo `+`, color `accent`
- Compactos: `₲ 1,2M`, `₲ 500k` (lista/cards)

```ts
export function fmtGs(n: number): string {
  return `₲ ${Math.abs(Math.round(n)).toLocaleString('es-PY')}`;
}

export function fmtGsSigned(n: number): string {
  if (n < 0) return `− ${fmtGs(n)}`;
  if (n > 0) return `+ ${fmtGs(n)}`;
  return fmtGs(0);
}

export function fmtGsCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `₲ ${(n / 1_000_000).toLocaleString('es-PY', { maximumFractionDigits: 1 })}M`;
  if (abs >= 1_000)     return `₲ ${(n / 1_000).toLocaleString('es-PY', { maximumFractionDigits: 0 })}k`;
  return fmtGs(n);
}
```

## 6. Microcopy esencial (es-PY, tuteo)

| Contexto | Texto |
|---|---|
| CTA principal | `Agregar gasto` |
| Estado vacío gastos | `Todavía no hay gastos` |
| Invitación | `Invitá a tu equipo` |
| Resumen | `Balance del grupo` |
| Saludo home | `Hola, {nombre}` |
| Deuda recibida | `te deben` |
| Deuda propia | `debés` |
| Login tab | `Ingresar` |
| Signup tab | `Registrarme` |
| Recuperar pass | `¿Olvidaste tu contraseña?` |
| OAuth divider | `o continuar con` |
| Switch a signup | `¿Nuevo en WallaTeam? **Crear cuenta**` |
| Switch a login | `¿Ya tenés cuenta? **Ingresá**` |
| CTA login | `Ingresar` |
| CTA signup | `Crear mi cuenta` |
| CTA crear wallet | `Crear wallet` |
| CTA cancelar | `Cancelar` |

## 7. Modelo de datos Supabase (resumen)

Tablas (detalle SQL en `design_handoff_wallateam_mvp/README.md` líneas 169-247 y en `app/supabase/schema.sql` tras Fase 1.04):

- `profiles` — extiende `auth.users` con full_name, avatar_url, email
- `currencies` — catálogo (PYG, USD, ARS, EUR)
- `wallets` — id, name, type (`personal`/`team`), icon, color, currency_code, initial_balance, target_date, budget_alert_pct, is_private, owner_id, archived_at
- `wallet_members` — (wallet_id, user_id, role: `admin`/`member`)
- `expenses` — wallet_id, description, amount, category, paid_by, occurred_at, photo_url, split_mode (`equal`/`percent`/`amount`)
- `expense_splits` — (expense_id, user_id, percentage, amount)
- `wallet_invites` — wallet_id, email, invite_code, invited_by, expires_at

**RLS regla crítica:** miembros de un wallet de equipo solo ven sus gastos. Wallets personales son privadas.

## 8. Reglas obligatorias del agente

> Estas reglas se aplican **en toda fase y todo módulo**. Romperlas significa romper el handoff.

1. **Antes de cualquier acción**, leer `bitacora/STATE.md` para saber dónde estás.
2. **Antes de cada módulo**, leer su prompt entero + los archivos del handoff que referencia.
3. **Al terminar cada módulo**, actualizar:
   - `bitacora/STATE.md` (nuevo último completado / próximo a ejecutar / fecha + máquina)
   - `bitacora/CHANGELOG.md` (append entry con paths tocados)
   - `bitacora/TASKS.md` (mover items entre secciones)
4. **Cada fase cierra con git commit** siguiendo el commit message del módulo `99-close-phase.md`.
5. **Validación visual obligatoria**: antes de marcar un módulo de UI como done, comparar contra `WallaTeam Prototype.html` lado a lado.
6. **No inventar componentes ni colores.** Reusar los del handoff. Cualquier desviación va documentada en `bitacora/DECISIONS.md`.
7. **Microcopy literal.** No traducir, no parafrasear. El tuteo paraguayo es parte de la marca.
8. **No hardcodear valores que ya existen como token.** Importar siempre de `theme/tokens.ts`.
9. **No saltarse fases.** El orden es: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08.
10. **Si encontrás un blocker que no podés resolver**, NO improvises: documentar el problema en `bitacora/STATE.md` bajo sección `## Blocker` y detener.
11. **Convenciones de código:**
    - TypeScript strict: prohibido `any` salvo justificación documentada
    - Imports absolutos vía `@/` (configurar `tsconfig.json` paths)
    - Named exports salvo screens de expo-router (default)
    - Componentes en PascalCase, hooks en camelCase con prefijo `use`
12. **Referencias de archivo en respuestas:** usar formato `[file:line](path#L)` para que sean clickeables en el IDE.

## 9. Roadmap de fases

| Fase | Carpeta | Alcance |
|---|---|---|
| 1 | `01-fase-auth` | Setup, theme, fonts, Supabase, Login/Registro |
| 2 | `02-fase-wallets-personales` | Home, Crear wallet, Detalle (personales solo) |
| 3 | `03-fase-gastos` | Agregar/editar/listar gastos en wallet personal |
| 4 | `04-fase-equipo` | Wallets type='team', invitaciones, miembros, RLS team |
| 5 | `05-fase-splits` | Modos equal/%/₲, validaciones, expense_splits |
| 6 | `06-fase-balance` | Cálculo de deudas (minimización), saldar |
| 7 | `07-fase-multimoneda` | USD, ARS, conversión opcional |
| 8 | `08-fase-extras` | Foto ticket, push notifications, charts mensuales |

## 10. Convención de prompts

Cada archivo `NN-modulo.md` dentro de una fase tiene esta estructura fija:

```markdown
# NN — Título del módulo

## Objetivo
Una línea: qué entrega este módulo.

## Pre-requisitos
- Módulos previos completados
- Dependencias externas listas (ej. supabase project creado)

## Contexto necesario
Lista de archivos a leer antes de empezar.

## Tareas
1. Step concreto y verificable
2. ...

## Validación
Cómo confirmar que el módulo funciona (comandos, capturas mentales, contraste vs mock).

## Cierre
- Entry para `bitacora/CHANGELOG.md`
- Update para `bitacora/STATE.md`
- Tareas a mover en `bitacora/TASKS.md`
```

---

**Última actualización del MASTER:** 2026-04-28
