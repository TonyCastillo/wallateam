# Fase 7 — Multimoneda (diferida indefinidamente)

**Estado:** ⏸️ Out-of-scope MVP — diferida sin fecha.
**Decidido:** 2026-05-20 — el lanzamiento inicial es PYG-only en Paraguay; agregar conversión USD/ARS introduce complejidad (rates, totales agregados, redondeo cross-currency) sin valor en el público objetivo del MVP.

## Por qué la carpeta está vacía

Esta fase nunca llegó a tener prompts ejecutables. El alcance original (de `prompts/00-MASTER.md` §9 y `README.md`) era:

> Wallets en USD y ARS además de PYG. Conversión a moneda principal del usuario al mostrar totales agregados (`BalanceCard`, `useTotalBalance`). Tabla `currencies` ya existe en `schema.sql`.

## Costo de saltarla

Cero. El schema ya tiene `wallets.currency_code` con default `'PYG'`, y todo el código de la app asume guaraníes sin friction. Si en el futuro se reactiva esta fase, lo que hay que tocar es:

- Componentes que muestran totales agregados (`BalanceCard`, `useTotalBalance`, `useWalletMetrics`) — convertir a la moneda principal del usuario antes de sumar.
- `fmtGs` deja de ser el único formatter — necesita un `fmtMoney(amount, currencyCode)` genérico (o uno por moneda).
- Hidratar `currencies` con USD/ARS/EUR en `schema.sql`.
- UI de selección de moneda en `create-wallet.tsx` (hoy está hardcoded PYG).
- Fuente de FX rates (API externa o tabla `fx_rates` actualizada por cron).

Ninguno de esos cambios es destructivo respecto al estado actual — todos son aditivos sobre infra que ya está pensada para multi-moneda.

## Si querés reactivar esta fase

1. Eliminar este archivo.
2. Escribir `00-overview.md` con scope concreto (¿solo display? ¿conversión real? ¿edición de FX rates manual o vía API?).
3. Descomponer en módulos siguiendo el patrón de Fases 5-6 (~6 módulos + `99-close-phase.md`).
4. Actualizar `STATE.md`, `TASKS.md` y `README.md` reactivando la fila Fase 7.
