# Handoff: WallaTeam — MVP Mobile App

Este paquete contiene todo el contexto visual, branding y especificación funcional necesaria para implementar el MVP de **WallaTeam** en React Native. Empezá por este README — luego revisá los archivos en `branding/` y abrí `WallaTeam Prototype.html` en el navegador para ver los mocks interactivos.

---

## 🎯 Overview

**WallaTeam** es una app móvil de gestión de gastos compartidos en grupo (familias, parejas, amigos, equipos). El concepto central es la **Wallet** — billeteras que pueden ser **personales** o **en equipo**, donde se cargan gastos y se dividen entre miembros.

**Slogan:** _Gastos compartidos, sin enredos. Tu billetera en equipo._

**Propuesta de valor:** simplificar la organización financiera colectiva con una experiencia clara, rápida y sin fricciones.

---

## 📦 Sobre los archivos de diseño

Los archivos HTML/JSX en este bundle son **mockups de referencia** creados para visualizar el diseño — **no son código de producción para copiar tal cual**.

Tu tarea es **recrear estos diseños en React Native** siguiendo el design system documentado, los patrones de la stack elegida, y el branding visual. Si ya hay un repo, respetá sus convenciones; si arrancás de cero, seguí las recomendaciones del README.

**Fidelidad:** **Mid-fi funcional** — el branding (colores, tipografía, espaciado) es preciso; la microcopy es definitiva; los íconos son representativos pero pueden reemplazarse por los de `lucide-react-native`.

---

## 🛠️ Stack recomendado

| Área | Sugerencia |
|---|---|
| Framework | **React Native** + **Expo SDK 50+** |
| Lenguaje | TypeScript (strict) |
| Navegación | `expo-router` (file-based routing) |
| Estado | **Zustand** + persist a `AsyncStorage` |
| Backend / DB | **Supabase** (auth + Postgres + RLS + realtime para wallets en equipo) |
| Estilos | **NativeWind** (Tailwind RN) **o** StyleSheet con tokens centralizados |
| Íconos | `lucide-react-native` |
| Tipografía | `expo-font` cargando **Inter** (400, 500, 600, 700) |
| Forms | `react-hook-form` + `zod` |
| Internacionalización | `i18n-js` — locale default `es-PY` |
| Formato moneda | `Intl.NumberFormat('es-PY')` |

---

## 🎨 Design Tokens (fuente de verdad)

> Estos tokens están duplicados en `branding/walla_team_design_system.md` con el formato exacto de React Native. Tu `theme.ts` debe matchear esto **al carácter**.

### Colores

```ts
export const colors = {
  // Primarios
  primary:        '#16A085',  // verde azulado — branding, CTAs principales
  primaryDark:    '#138D75',  // hover/pressed del primary
  secondary:      '#1F3A5F',  // azul profundo — headers, fondos oscuros
  accent:         '#2ECC71',  // verde claro — acciones positivas, montos +

  // Superficies
  background:     '#FFFFFF',
  surface:        '#F8F9FA',
  surfaceAlt:     '#F1F4F6',  // alt para cards anidados

  // Texto
  textPrimary:    '#2C3E50',
  textSecondary: '#7F8C8D',

  // Bordes y estados
  border:         '#E5E7EB',
  danger:         '#E74C3C',
  warning:        '#F39C12',
  success:        '#2ECC71',

  // Chips translúcidos
  chipBg:         'rgba(22,160,133,0.10)',  // verde 10%
  chipBgBlue:     'rgba(31,58,95,0.08)',    // azul 8%
};
```

### Dark Mode

```ts
export const colorsDark = {
  background:    '#0E1B2C',
  surface:       '#15263C',
  surfaceAlt:    '#1B2E47',
  border:        '#243B58',
  textPrimary:   '#ECF0F1',
  textSecondary: '#9AA8B6',
  primary:       '#16A085',     // mismo
  secondary:     '#5DA9E9',     // azul más claro para contraste
  accent:        '#2ECC71',
  danger:        '#FF6B5B',
  chipBg:        'rgba(46,204,113,0.14)',
  chipBgBlue:    'rgba(93,169,233,0.16)',
};
```

### Tipografía

- **Familia primaria:** Inter (Google Fonts)
- **Familia secundaria (display, opcional):** Poppins
- **Pesos cargados:** 400 Regular, 500 Medium, 600 SemiBold, 700 Bold

```ts
export const typography = {
  fontFamily: {
    regular:  'Inter_400Regular',
    medium:   'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold:     'Inter_700Bold',
  },
  fontSize: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28, '3xl': 36,
  },
  lineHeight: { sm: 18, base: 22, lg: 26 },
};
```

### Espaciado y radios

```ts
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius  = { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 };
```

### Sombras

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

---

## 💸 Reglas de moneda

- **Default:** Guaraníes paraguayos (PYG, símbolo `₲`)
- **Formato:** `₲ 2.000.000` (separador de miles `.`, **sin decimales** para PYG)
- **Negativos:** prefijo `−` (minus signo, no guion ASCII), color `danger`
- **Positivos en signed contexts:** prefijo `+`, color `accent`
- **Compactos:** `₲ 1,2M`, `₲ 500k` (para listas/cards)
- **Arquitectura:** la moneda es una **entidad** — cada Wallet tiene `currency_code`. PYG es default pero el modelo soporta USD, ARS, EUR, etc. desde el día 1.

```ts
function fmtGs(n: number): string {
  return `₲ ${Math.abs(Math.round(n)).toLocaleString('es-PY')}`;
}
```

---

## 🗂️ Modelo de datos (Supabase)

```sql
-- Users (manejado por Supabase Auth, extendido)
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text not null,
  email text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Currencies (catálogo)
create table currencies (
  code text primary key,             -- 'PYG', 'USD', 'ARS'
  symbol text not null,              -- '₲', '$', '$'
  name text not null,                -- 'Guaraní paraguayo'
  decimals smallint not null default 0
);

-- Wallets
create table wallets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('personal','team')),
  icon text not null default 'wallet',     -- 'piggy','plane','home2', etc.
  color text not null default '#16A085',
  currency_code text not null default 'PYG' references currencies(code),
  initial_balance numeric(18,2) not null default 0,
  target_date date,                        -- fecha objetivo (opcional)
  budget_alert_pct smallint default 80,    -- aviso al 80% (opcional)
  is_private boolean default false,
  owner_id uuid not null references profiles(id),
  created_at timestamptz default now(),
  archived_at timestamptz
);

-- Miembros de wallet (solo para type='team')
create table wallet_members (
  wallet_id uuid references wallets(id) on delete cascade,
  user_id uuid references profiles(id),
  role text not null default 'member' check (role in ('admin','member')),
  joined_at timestamptz default now(),
  primary key (wallet_id, user_id)
);

-- Gastos
create table expenses (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references wallets(id) on delete cascade,
  description text not null,
  amount numeric(18,2) not null,           -- siempre positivo
  category text,                            -- 'food','transport','home', etc.
  paid_by uuid not null references profiles(id),
  occurred_at timestamptz not null default now(),
  photo_url text,                           -- ticket adjunto
  note text,
  split_mode text not null default 'equal' check (split_mode in ('equal','percent','amount')),
  created_at timestamptz default now()
);

-- Cómo se divide cada gasto
create table expense_splits (
  expense_id uuid references expenses(id) on delete cascade,
  user_id uuid references profiles(id),
  percentage numeric(5,2),                  -- nullable si split_mode='amount'
  amount numeric(18,2) not null,            -- siempre el monto final
  primary key (expense_id, user_id)
);

-- Invitaciones a wallets de equipo
create table wallet_invites (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references wallets(id) on delete cascade,
  email text,
  invite_code text unique,
  invited_by uuid references profiles(id),
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz default now()
);
```

**RLS crítica:** los miembros de un wallet de equipo solo ven sus gastos. Wallets personales son privadas. Documentar policies por separado.

---

## 📱 Pantallas (5 — flujo MVP completo)

Mirá `WallaTeam Prototype.html` en el navegador para ver cada pantalla en device frame Android. Los archivos JSX en `lib/screen-*.jsx` son la fuente de verdad para layout y composición.

### 1. Login / Registro (`lib/screen-login.jsx`)

- **Propósito:** Onboarding inicial. Tabs entre "Ingresar" y "Registrarme".
- **Componentes:**
  - Logo `WTLogo` + título `WallaTeam` (con la `T` en `accent` y el resto en `secondary`)
  - Tagline: _"Gastos compartidos, sin enredos."_
  - Tabs segmented control (radius 14, padding 4)
  - Inputs con icon trailing — Email (icon `mail`), Password (icon `lock` + eye toggle), Nombre (icon `user`, solo signup)
  - Link "¿Olvidaste tu contraseña?" en `primary`
  - CTA gradient `linear-gradient(135deg, #16A085 0%, #1F3A5F 120%)` con shadow
  - Divider "o continuar con"
  - Botón Google OAuth (border + logo)
- **Validaciones:**
  - Email: regex estándar
  - Password: min 8 caracteres, al menos 1 número
  - Nombre (signup): min 2 caracteres
- **Auth:** Supabase Auth → email/password + Google OAuth (provider).

### 2. Home — Wallets (`lib/screen-home.jsx`)

- **Propósito:** Pantalla principal post-login. Ver todas las wallets (personales + equipo), balance total, accesos rápidos, actividad reciente.
- **Layout (top-down):**
  1. Top bar: avatar + saludo + bell con badge de notificaciones
  2. **Card de balance total** (gradient secondary→primary, radius 20, padding 18) con:
     - Label `BALANCE TOTAL` (caps, opacity 0.8)
     - Monto grande (28px bold, `fmtGs`)
     - Split en 2: PERSONAL | EN EQUIPO (con divider vertical)
  3. **Quick actions** (4 botones row): Gasto (primary fill), Wallet, Invitar, Saldar
  4. **Sección "Mis wallets"** con header + "Ver todas"
  5. Lista de cards de wallet (radius 16, surface bg) — ver `WalletRow`
  6. **Sección "Actividad reciente"** con últimos gastos
  7. Bottom nav (5 items con FAB central elevado)
- **WalletRow:**
  - Icon en cuadrado coloreado (radius 12, bg = color20% opacidad)
  - Nombre + chip de tipo (`PERSONAL` verde / `EQUIPO` azul) + subtítulo
  - Monto compacto a la derecha (`fmtGsCompact`) + "disponible"
- **Bottom nav** items: Wallets, Actividad, **+ FAB**, Resumen, Perfil.

### 3. Crear Wallet (`lib/screen-create-wallet.jsx`)

- **Propósito:** Formulario para crear una nueva wallet personal o de equipo, con presupuesto inicial.
- **Campos (en orden):**
  1. **Preview header** — gradient con el color/icon elegidos en vivo
  2. **Tipo:** toggle visual Personal | En equipo (cards con ícono)
  3. **Nombre:** input con contador `n/40`
  4. **Ícono y color:** grid 8 opciones (piggy, home2, plane, briefcase, gift, sparkle, shopping, food). Selección con ring visual.
  5. **Moneda:** selector (default PYG, dropdown para futuras)
  6. **Presupuesto / saldo inicial:** input grande con símbolo ₲ + chips quick-add (`+100k`, `+500k`, `+1M`, `+5M`) + nota explicativa
  7. **Miembros** (solo si type='team'): lista con admin (vos) + invitados + CTA "Invitar por email o link"
  8. **Opcionales** (toggles):
     - Fecha objetivo (date picker)
     - Avisos de presupuesto (notificar al X%)
     - Wallet privada (no aparece en resumen general)
- **CTAs (footer fijo):** Cancelar (secondary) | Crear wallet (primary gradient)
- **Validación:** nombre requerido (2-40 chars); presupuesto >= 0; al menos 1 miembro si team; ícono y color obligatorios.

### 4. Detalle de Wallet (`lib/screen-wallet-detail.jsx`)

- **Propósito:** Ver gastos, balance por miembro, progreso del presupuesto. Ejemplo: "Viaje en Familia" (team).
- **Layout:**
  1. **Header gradient** con back arrow + settings, ícono+chip+nombre, métricas (Presupuesto / Gastado / Restante), barra de progreso, "% usado | días restantes"
  2. **Avatares de miembros** (overlap stack) + nombres + CTA "+ Invitar"
  3. **Card de balance del grupo** — quién debe a quién, con avatar, monto signed, label "te deben" / "debés"
  4. **Tabs:** Gastos (activa) | Resumen | Miembros
  5. **Lista de gastos** — icon, descripción, "Pagó X · fecha", chip de modo de split, monto
- **Estados:** vacío ("Todavía no hay gastos"), loading, error.

### 5. Agregar Gasto (`lib/screen-add-expense.jsx`)

- **Propósito:** Cargar un nuevo gasto en una wallet, con split por porcentajes.
- **Campos:**
  1. **Monto** — input grande (36px bold) con ₲ + chip de moneda
  2. **Descripción** + categoría (icon `tag`)
  3. **Wallet** (selector — muestra el chip EQUIPO/PERSONAL)
  4. **Fecha** (default ahora, con time)
  5. **Pagado por** (avatar + nombre — selector entre miembros si es team)
  6. **Cómo dividir** — toggle de modo: `=` equitativo | `%` porcentaje | `₲` monto fijo
     - Si %: cada miembro tiene barra visual, input de %, monto calculado
     - Si =: divide auto entre N miembros activos
     - Si ₲: input numérico libre, suma debe = total
     - Validación: la suma debe ser exactamente 100% (o = total si `₲`); badge "Total asignado: 100% · ₲ X"
  7. **Adjuntar ticket** (camera) + extras
- **CTAs:** Cancelar | Guardar gasto (primary gradient)

---

## 🎨 Logo y key visual

- `branding/wallateam-logo.png` — logo principal (texto + isotipo + variantes de app icon)
- **Concepto:** "Conexión + dinero + colaboración" — billetera central conectando 3 personas, con una W estilizada
- **Variantes a generar:** logo principal, isotipo (solo W+billetera), app icon (3 fondos: blanco, verde, azul oscuro)
- **Uso del logo en la app:** `WTLogo` SVG inline en `lib/wallateam-ui.jsx` (size por defecto 56px). Replicar en RN como SVG.

---

## 🗣️ Tono y microcopy

- **Voz:** cercano, claro, directo, sin tecnicismos financieros
- **Microcopy base:**
  - CTA principal: `Agregar gasto`
  - Estado vacío: `Todavía no hay gastos`
  - Invitación: `Invitá a tu equipo`
  - Resumen: `Balance del grupo`
  - Saludo home: `Hola, {nombre}`
  - "Te deben" / "Debés" (segunda persona, tuteo argentino/paraguayo)

---

## 🚀 Roadmap por fases sugerido

| Fase | Alcance |
|---|---|
| **Fase 1 · Auth** | Email/pass + Google OAuth, profiles table, expo-router con grupo `(auth)` |
| **Fase 2 · Wallets personales** | CRUD wallet (Crear, Home, Detalle), tokens, navegación, theming |
| **Fase 3 · Gastos** | Crear/editar/listar gastos en wallet personal |
| **Fase 4 · Equipo** | Wallets type='team', invitaciones, miembros, RLS Supabase |
| **Fase 5 · Splits** | Modos equitativo / % / ₲, validaciones, expense_splits |
| **Fase 6 · Balance** | Cálculo de deudas (algoritmo de minimización), saldar |
| **Fase 7 · Multimoneda** | USD, ARS, conversión opcional, formato dinámico |
| **Fase 8 · Extras** | Foto de ticket, notificaciones push, resumen mensual con charts |

---

## 📁 Archivos en este bundle

```
design_handoff_wallateam_mvp/
├── README.md                              ← este archivo
├── WallaTeam Prototype.html               ← prototipo navegable (abrir en browser)
├── branding/
│   ├── walla_team_branding_guide.md       ← guía de marca completa
│   ├── walla_team_design_system.md        ← tokens en formato RN
│   └── wallateam-logo.png                 ← logo principal y variantes
├── assets/
│   └── wallateam-logo.png
└── lib/                                   ← código fuente del prototipo
    ├── wallateam-ui.jsx                   ← tokens, iconos, primitives, WTPhone, BottomNav
    ├── screen-login.jsx                   ← Login/Registro
    ├── screen-home.jsx                    ← Home con SAMPLE_WALLETS
    ├── screen-create-wallet.jsx           ← Form crear wallet
    ├── screen-wallet-detail.jsx           ← Detalle con balance grupal
    ├── screen-add-expense.jsx             ← Agregar gasto con splits
    ├── design-canvas.jsx                  ← shell del canvas (no portar)
    ├── android-frame.jsx                  ← device frame (no portar)
    └── tweaks-panel.jsx                   ← panel de tweaks (no portar)
```

> Los archivos `design-canvas.jsx`, `android-frame.jsx` y `tweaks-panel.jsx` son **infraestructura del prototipo** — no necesitás portarlos a RN.

---

## ✅ Checklist mínimo para empezar

1. Leer este README completo
2. Abrir `WallaTeam Prototype.html` en el navegador (alternar light/dark con el panel de Tweaks)
3. Leer `branding/walla_team_design_system.md` para tokens exactos
4. Setup proyecto: `npx create-expo-app wallateam --template`
5. Instalar deps: `expo-router`, `zustand`, `@supabase/supabase-js`, `lucide-react-native`, `react-native-svg`, `expo-font`, `react-hook-form`, `zod`
6. Crear `theme/tokens.ts` con todos los tokens
7. Cargar fonts Inter en `app/_layout.tsx` con `expo-font`
8. Configurar Supabase project + correr SQL del modelo de datos
9. Empezar por **Fase 1 (Auth)** y avanzar secuencialmente

¡Suerte! 🚀
