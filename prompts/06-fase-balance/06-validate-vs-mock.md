# 06.06 — Validación visual contra mock

## Objetivo
Confirmar que la implementación calza con el ground truth de diseño en `design_handoff_wallateam_mvp/lib/screen-wallet-detail.jsx`.

## Checklist

### `BalanceLine` (componente nuevo)
- [ ] Avatar 28px circular, color primary si net > 0 / secondary si net < 0.
- [ ] Nombre 13px font-weight 500 textPrimary.
- [ ] Monto 13px bold con `fmtGsSigned` (incluye `+` o `−`).
- [ ] Color del monto: accent (verde) si positive, danger (rojo) si negative.
- [ ] Sublabel 10px textSecondary: literal "te deben" / "debés" / "saldado".
- [ ] Layout: row gap 10, alignItems center, monto y sublabel alineados a la derecha.

### `TransferLine` (componente nuevo, no en mock — diseño consistente con app)
- [ ] Avatar from 24px → ícono ArrowRight 16px → Avatar to 24px.
- [ ] Texto: "{from} debe {monto} a {to}" — usar fmtGs sin signo.
- [ ] Si involucra al current user: card con borde accent + botón "Marcar como saldado" a la derecha (verde).

### Tab Resumen
- [ ] En wallets `type='team'`: muestra balance + transferencias (no placeholder).
- [ ] En wallets `type='personal'`: mantiene placeholder "Próximamente — Fase 8".
- [ ] Header "TU SALDO" en uppercase 11px semibold textSecondary.
- [ ] Monto del usuario debajo: 22px bold, color según signo.
- [ ] Sección "Balance del grupo" con la misma label uppercase y lista.
- [ ] Sección "Transferencias necesarias" con label uppercase y lista.

### Microcopy
- [ ] "te deben" (lowercase con tilde correcta)
- [ ] "debés" (con tilde)
- [ ] "saldado"
- [ ] "Marcar como saldado" (botón)
- [ ] "Pago entre miembros" (description default de la settlement)
- [ ] "¡Todo saldado!" + "Nadie debe nada al resto del grupo." (empty state)

## Validación
Comparar visualmente la pantalla en Expo Go contra el mock JSX renderizado en `WallaTeam Prototype.html`. Tolerar diferencias menores de spacing pero matchear colores, weights, y microcopy literal.

## Bitácora
Entry `[06.06]` en CHANGELOG. Commit `style(balance)[06.06]: validación visual y ajustes finales`.
