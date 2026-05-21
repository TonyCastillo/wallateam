# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read-before-acting (non-negotiable)

This repo is driven by a prompt-pack + bitácora workflow. **Before touching any code**, read in this order:

1. [`prompts/00-AGENT-HANDOFF.md`](prompts/00-AGENT-HANDOFF.md) — how to resume the project
2. [`prompts/00-MASTER.md`](prompts/00-MASTER.md) — stack, tokens, microcopy, model, rules
3. [`bitacora/STATE.md`](bitacora/STATE.md) — current phase, last completed module, **`Próximo módulo a ejecutar:`** pointer, blockers, pending SQL to apply
4. [`bitacora/CHANGELOG.md`](bitacora/CHANGELOG.md), [`bitacora/TASKS.md`](bitacora/TASKS.md), [`bitacora/DECISIONS.md`](bitacora/DECISIONS.md)

`STATE.md` is authoritative for "where we are." Do not infer state from git or by scanning code — the bitácora is the source of truth.

## Repo layout (two-tier)

```
WallaTeam/                         ← git root, prompts + bitácora live here
├── design_handoff_wallateam_mvp/  ← READ-ONLY ground truth (mocks JSX, prototype HTML, branding, SQL)
├── prompts/0N-fase-X/             ← phase prompt packs (00-overview + NN-module.md + 99-close-phase.md)
├── bitacora/                      ← living project state (STATE/CHANGELOG/TASKS/DECISIONS)
└── app/                           ← the actual Expo project (run commands from here)
```

**`design_handoff_wallateam_mvp/` is read-only.** It is the visual ground truth. Validate UI against `design_handoff_wallateam_mvp/WallaTeam Prototype.html` and the per-screen mocks in `design_handoff_wallateam_mvp/lib/screen-*.jsx` before marking any UI module done.

## Common commands

All commands run from `app/`:

```bash
cd app
npm install --legacy-peer-deps   # first time per machine, or after package.json changes (see ADR-004)
npm start                         # expo start (Metro dev server)
npm run android | npm run ios | npm run web
npm run typecheck                 # tsc --noEmit (strict)
```

There is no test suite, no linter, and no formatter wired up — typecheck is the only automated gate. Do not invent test commands.

`--legacy-peer-deps` is required: Expo SDK 54 ships React 19.1 but `expo-router@6` pulls `react-dom@19.2.5` which demands `react@^19.2.5`, so npm 11 fails with ERESOLVE on any pure-JS dep add. Native deps go through `npx expo install` (which resolves compatibility itself). See ADR-004.

## Supabase: SQL is applied manually

The Supabase project is live (`azfcmdihftxtiwrvcfsh.supabase.co`) but **schema/RPC/policies are applied by pasting SQL files into the Supabase Dashboard SQL editor** — there is no migration tool. `STATE.md` always lists the pending SQL files in order (e.g. `schema.sql` → `policies.sql` → `expenses_rpc.sql` → ... → `balance_migration.sql`). Apply them in the documented order before running the app or generating an APK.

`app/.env` (Supabase URL + publishable key) is gitignored — copy it between machines manually or rebuild from the Supabase dashboard. "Confirm email" is OFF in dev and must be re-enabled before production release (ADR-007).

## Architecture

### Stack (Expo SDK 54, React 19.1, RN 0.81, TS strict)

- **Routing:** expo-router file-based with two route groups: [app/app/(auth)](app/app/(auth)/) (login) and [app/app/(app)](app/app/(app)/) which contains the `(tabs)` group (home / activity / stats / profile) plus `wallet/[id]`, `expense/new`, `invite/[code]`, `create-wallet`. `app/app/_layout.tsx` is the root. `experiments.typedRoutes` is **off** by design (ADR-008).
- **State:** Zustand stores in [app/stores/](app/stores/) (`auth`, `wallets`, `expenses`, `invites`), persisted to AsyncStorage where applicable.
- **Forms:** react-hook-form + zod resolvers; schemas in [app/schemas/](app/schemas/).
- **Backend:** `@supabase/supabase-js` via [app/lib/supabase.ts](app/lib/supabase.ts). Realtime subscriptions currently use the simple pattern of "refetch all on any change" (ADR-010) — fine for MVP, will likely need to be incremental later.
- **Styling:** `StyleSheet.create` + centralized tokens in [app/theme/tokens.ts](app/theme/tokens.ts) with `ThemeProvider` + `useTheme()` (ADR-002). **Never hardcode colors/spacing/radius/shadow — always import from tokens.** Dark mode uses a dual palette (`colors` / `colorsDark`); `Colors` is typed as `string`-valued (not literal) so both palettes assign to `Theme.colors` (ADR-006).
- **Path alias:** `@/*` → `./*` (configured in [app/tsconfig.json](app/tsconfig.json)).

### Domain model (Supabase)

Tables: `profiles`, `currencies`, `wallets`, `wallet_members`, `expenses`, `expense_splits`, `wallet_invites`. Wallets have `type ∈ {personal, team}`. Personal wallets behave like a bank account (`balance = initial_balance + sum(income) − sum(expense)`) and skip the "balance del grupo" concept entirely; team wallets carry splits and group-balance simplification.

**`expenses.kind`** is the discriminator that drives a lot of behavior — values are `'expense' | 'income' | 'settlement'`:
- `'income'` (ADR-013) lets personal wallets ingest deposits without a separate `incomes` table.
- `'settlement'` (ADR-015) records peer-to-peer payments inside team balance; filtered out of the regular expense list but consumed by `useBalance` / `computeNets` so net debts rebalance live.

**Atomic creation:** all expense inserts go through the RPC `create_expense_with_split` ([app/supabase/expenses_rpc.sql](app/supabase/expenses_rpc.sql), v2 in `expenses_rpc_v2.sql`) — never insert `expenses` + `expense_splits` separately from the client (ADR-011, ADR-014). The v2 RPC takes `p_split_mode` + `p_splits` (jsonb array) to support equal / percent / amount splits atomically; calls without `p_splits` fall back to the single-payer 100% behavior.

### Money + locale (PYG-first, multi-currency-ready)

- Format with `fmtGs` (from [app/lib/format.ts](app/lib/format.ts)) — full `es-PY` thousands separator, no decimals, `₲` symbol. **Do not reintroduce a compact `M/k` formatter** in mainline components (ADR-012); layouts have been restructured (`BalanceCard` autoshrinks, `WalletRow` is two-tier, wallet header metrics are stacked) to fit full amounts. A compact helper can be reintroduced *locally* if a future chart axis genuinely needs it.
- Negative sign is Unicode minus `U+2212` (`−`), not ASCII `-`.
- Microcopy is **es-PY with Paraguayan voseo** ("Invitá", "Ingresá", "Tenés", "Hola, {nombre}", "te deben" / "debés"). Do not translate, paraphrase, or "neutralize" it — it is part of the brand. See `prompts/00-MASTER.md` §6 for the canonical strings.

## Workflow rules

1. **Each module = one prompt file** under `prompts/0N-fase-X/NN-name.md`. Phases run strictly 01 → 08; don't skip ahead.
2. **At the end of each module**, update all three bitácora files: `STATE.md` (new last-completed + next-to-run + date + machine), `CHANGELOG.md` (append-only entry with touched paths), `TASKS.md` (move items between sections). Phase closes with the `99-close-phase.md` prompt and a git commit.
3. **Document non-obvious decisions in [bitacora/DECISIONS.md](bitacora/DECISIONS.md)** as a new ADR (context / decision / consequences). Trivial stack choices do not need an ADR.
4. **Reuse existing components.** [app/components/](app/components/) already has Avatar, AvatarStack, BalanceCard, BalanceLine, Button, CategoryPicker, Chip, ConfirmDeleteSheet, ExpenseRow, FormRow, Icon, IconBox, Input, Metric, ProgressBar, QuickAction, SaldarSheet, SectionHeader, SplitRow, Tabs, ToggleRow, TransactionTypeSheet, TransferLine, WalletPickerSheet, WalletRow, etc. Check before inventing a new one.
5. **TypeScript strict, no `any`** without a documented justification. Named exports everywhere except expo-router screens (default export).
6. **Blocker discipline:** if something blocks the current module, write it under `## Blocker` in `STATE.md` and stop — don't improvise around it or skip the module.
