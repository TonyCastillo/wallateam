# Fase 4 — Equipo (Wallets type='team')

## Objetivo
Habilitar wallets compartidas entre varios usuarios. Un usuario puede crear una wallet "Equipo", invitar a otros por código de invitación (deep link), ver los miembros y crear gastos con `paid_by` apuntando a cualquier miembro.

**Fuera del alcance de esta fase:**
- Cálculo de deudas / balance del grupo → Fase 6
- Splits con porcentajes → Fase 5
- Multimoneda → Fase 7

## Mocks ground truth
- `design_handoff_wallateam_mvp/lib/screen-create-wallet.jsx` — sección "Miembros" para type='team'
- `design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx` — avatares overlap en header, tab Miembros con lista, botón "Invitar"

## Módulos

| # | Nombre | Descripción breve |
|---|---|---|
| 01 | CreateWallet team | Habilitar type='team', sección Miembros, auto-agregar creador como owner |
| 02 | wallet_invites store | Tabla `wallet_invites`, store Zustand, crear invite con `invite_code`, aceptar invite |
| 03 | Deep link invitación | Pantalla `/invite/[code]` que lee el invite y lo acepta con un tap |
| 04 | Miembros en Detalle | Avatares overlap en header, tab Miembros con lista de miembros y botón Invitar |
| 05 | paid_by selector | Selector de "Pagado por" en Agregar Gasto cuando hay >1 miembro |
| 06 | Validación visual | Checklist contra mock HTML. ≥95% visual + 100% microcopy |
| 99 | Cerrar fase | Smoke test E2E, commit de cierre, plantilla prompt Fase 5 |

## Stack a usar (sin cambios)
- Supabase: tabla `wallet_invites` + policies RLS (ya en schema.sql)
- Expo deep links: `scheme=wallateam`, `wallateam://invite/CODE`
- `expo-linking` para parsear la URL entrante
- Zustand store nuevo `useInvites`
- Componentes existentes: `Avatar`, `Chip`, `IconBox`, `ConfirmDeleteSheet`
- Microcopy literal es-PY

## Supabase — tabla `wallet_invites` (ya en schema.sql)
```sql
wallet_invites (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references wallets(id) on delete cascade,
  invite_code text unique not null,
  created_by uuid references profiles(id),
  accepted_by uuid references profiles(id),
  email text,              -- opcional: invitar por email específico
  status text default 'pending',  -- pending | accepted | revoked
  expires_at timestamptz,
  created_at timestamptz default now()
)
```

## Orden de ejecución
Ejecutar módulos en orden numérico. Cada módulo actualiza bitácora al cerrar.
