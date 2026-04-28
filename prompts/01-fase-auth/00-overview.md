# Fase 1 — Auth · Overview

## Alcance
Setup completo del proyecto Expo + RN + TypeScript + Supabase, con tema y fuentes Inter cargadas, y la pantalla de **Login / Registro** funcional contra Supabase Auth (email + password). Esta fase deja la base sobre la cual se construyen todas las pantallas siguientes.

## Entregables (criterios de done)

Al cerrar esta fase debe poder demostrarse:

1. ✅ Levantar el dev server (`npx expo start`) sin errores de compilación
2. ✅ Cargar la app en Expo Go con fuentes **Inter** renderizadas (no system font)
3. ✅ Ver la pantalla de Login con tabs **Ingresar** / **Registrarme**, visualmente idéntica al mock [screen-login.jsx](../../design_handoff_wallateam_mvp/lib/screen-login.jsx) (≥95% match)
4. ✅ **Login** con email+password contra Supabase Auth real → redirige a placeholder `(app)/index.tsx`
5. ✅ **Signup** con nombre+email+password → crea row en `profiles` table → auto-login
6. ✅ **Logout** disponible en placeholder home (botón visible)
7. ✅ Sesión **persiste vía AsyncStorage** (cerrar app y volver a abrir mantiene login)
8. ✅ **Validación zod**: email regex, password ≥ 8 chars con al menos 1 número, nombre ≥ 2 chars
9. ✅ Toggle **eye / eye-off** funciona, password masked por default
10. ✅ Forgot password (placeholder UI funcional, sin envío real esta fase)
11. ⏸ Google OAuth diferido a Fase 1.5 (botón muestra `Alert.alert('Próximamente')`)
12. ✅ Bitácora actualizada: `STATE.md` apunta a Fase 2, `CHANGELOG.md` con entries por módulo

## Pre-requisitos del usuario

Antes de arrancar Fase 1 el usuario debe tener:
- Node.js 20+ y npm instalados
- Expo Go en su teléfono (Android o iOS)
- Cuenta gratuita en [supabase.com](https://supabase.com)

## Módulos en orden

| # | Módulo | Tiempo estim. | Bloquea siguiente |
|---|---|---|---|
| 01 | [01-setup-expo.md](01-setup-expo.md) | 15 min | Sí |
| 02 | [02-theme-tokens.md](02-theme-tokens.md) | 10 min | Sí |
| 03 | [03-fonts-inter.md](03-fonts-inter.md) | 10 min | No (UI puede arrancar antes) |
| 04 | [04-supabase-client.md](04-supabase-client.md) | 25 min | Sí (login lo usa) |
| 05 | [05-screen-login.md](05-screen-login.md) | 60 min | Sí |
| 06 | [06-validate-vs-mock.md](06-validate-vs-mock.md) | 20 min | Sí |
| 99 | [99-close-phase.md](99-close-phase.md) | 10 min | — |

## Salida esperada al cerrar fase

- Repo `WallaTeam/app/` con scaffold Expo funcional
- Pantalla de login operativa
- Project Supabase con schema + RLS aplicados
- `bitacora/STATE.md` apuntando a `prompts/02-fase-wallets-personales/00-overview.md`
- Commit en git: `feat(auth): fase 1 - login, signup, sesión persistente con Supabase`
