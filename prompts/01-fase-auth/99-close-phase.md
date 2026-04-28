# 99 — Cerrar Fase 1 (Auth)

## Objetivo
Smoke test E2E final, commit, actualización de bitácora, y plantilla de prompt para arrancar Fase 2.

## Pre-requisitos
- Módulos 01-06 completados

## Tareas

### 1. Smoke test E2E final

Probar el flow completo de punta a punta:

1. **Limpiar storage** del Expo Go (Settings → Data → Clear) o instalar limpio
2. Abrir app → arranca en `/login`
3. Tocar **Registrarme** → completar nombre+email+password → tocar **Crear mi cuenta**
4. ✅ Redirige a placeholder home con saludo personalizado
5. Verificar en Supabase Dashboard:
   - `auth.users` tiene 1 row nueva
   - `profiles` tiene 1 row con `full_name` correcto y `email` matching
6. Tocar **Cerrar sesión** → vuelve a `/login`
7. Tocar **Ingresar** → mismo email + password → entra a home
8. Force-quit Expo Go → reabrir → entra directo a home (sesión persistida)
9. Cambiar tema del OS a dark → recargar → todo se ve correcto en dark
10. `npx tsc --noEmit` sin errores
11. `npx expo lint` (si está configurado) sin errores críticos

### 2. Limpiar y commitear

```bash
cd f:/proyectos_2026/WallaTeam/WallaTeam
git add -A
git status   # revisar que .env NO está incluido
git commit -m "feat(auth): fase 1 - login, signup, sesión persistente con Supabase

- Setup Expo + TS strict + expo-router
- Theme tokens light/dark + Inter (400/500/600/700)
- Supabase project con schema, RLS y trigger handle_new_user
- Pantalla Login/Registro con tabs, validación zod, eye toggle
- Auth gate redirige según sesión, persiste vía AsyncStorage
- Google OAuth diferido a Fase 1.5"
```

### 3. (Opcional) Push a remote

Si tenés un repo remoto configurado (GitHub/GitLab):

```bash
git push origin main
```

Esto permite retomar el proyecto desde otra máquina con `git pull`.

### 4. Actualizar bitácora — cerrar fase

`bitacora/STATE.md`:

```markdown
**Última actualización:** 2026-MM-DD HH:MM (máquina: laptop-X)
**Fase activa:** 02-fase-wallets-personales
**Último módulo completado:** 01.99-close-phase (Fase 1 cerrada ✅)
**Próximo módulo a ejecutar:** prompts/02-fase-wallets-personales/00-overview.md (a crear)
```

`bitacora/CHANGELOG.md` — agregar al final:

```markdown
## [01.99] 2026-MM-DD — Fase 1 (Auth) cerrada ✅
- Smoke test E2E pasado (10/10)
- Commit `feat(auth): fase 1 - ...` creado
- Próxima fase: 02-fase-wallets-personales
```

`bitacora/TASKS.md`:
- Mover toda la sección "[Fase 1] ..." a Done
- Crear sección "[Fase 2] ..." en Pendiente con los módulos a definir

### 5. Plantilla de prompt para arrancar Fase 2

Pegar este prompt al usuario (o al próximo agente) cuando quiera arrancar Fase 2:

```
Empezá Fase 2 (Wallets personales) del proyecto WallaTeam.

Lectura obligatoria antes de cualquier acción:
1. prompts/00-AGENT-HANDOFF.md
2. prompts/00-MASTER.md
3. bitacora/STATE.md, CHANGELOG.md, TASKS.md, DECISIONS.md

Después:
- Crear los archivos de prompts/02-fase-wallets-personales/ siguiendo la estructura
  de prompts/01-fase-auth/ (00-overview, 01..N módulos, 99-close-phase)
- Mocks ground truth: lib/screen-home.jsx, lib/screen-create-wallet.jsx,
  lib/screen-wallet-detail.jsx (este último mostrará data dummy hasta Fase 4)
- Módulos sugeridos:
  01 - BottomNav + (app)/(tabs) layout
  02 - Wallet store + queries Supabase
  03 - Pantalla Home (balance card, quick actions, lista wallets)
  04 - Pantalla Crear Wallet (form completo, sin sección team que va Fase 4)
  05 - Pantalla Detalle Wallet (sin gastos reales, placeholder lista)
  06 - Validación visual contra prototipo
  99 - Cerrar fase

Recordá: actualizar bitácora al cerrar cada módulo, commit al cerrar fase.
```

## Validación

- ✅ Commit visible en `git log`
- ✅ `bitacora/STATE.md` apunta a Fase 2
- ✅ `bitacora/CHANGELOG.md` tiene la entrada de cierre
- ✅ Repo limpio (`git status` muestra working tree clean)

## Notas

Si algo falló en el smoke test, **no marcar fase como cerrada**. Volver al módulo correspondiente, fixearlo, re-validar. El close de fase es la garantía de calidad.
