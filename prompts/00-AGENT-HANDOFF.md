# 00 — AGENT HANDOFF (cómo retomar este proyecto)

> Soy un agente nuevo (o el mismo agente con contexto reseteado / cambio de máquina). Este archivo me dice exactamente qué hacer para retomar el proyecto WallaTeam sin perder ni un detalle.

---

## Reglas de oro

1. **No asumir nada del estado.** El estado vive en `bitacora/STATE.md`, no en mi memoria.
2. **No saltarse el orden de lectura.** Está pensado para minimizar tokens y maximizar contexto correcto.
3. **No empezar a codear sin haber leído el prompt del módulo entero.**
4. **Cerrar ciclo siempre:** ningún cambio se considera hecho hasta haber actualizado la bitácora.

## Orden de lectura obligatorio (en cada arranque)

Si recién entrás al proyecto, leé estos archivos en este orden exacto:

```
1. prompts/00-AGENT-HANDOFF.md   ← este archivo (ya lo estás leyendo)
2. prompts/00-MASTER.md          ← contexto global, stack, tokens, reglas
3. bitacora/STATE.md             ← dónde estamos parados ahora mismo
4. bitacora/CHANGELOG.md         ← historial de cambios (último al final)
5. bitacora/TASKS.md             ← qué está en curso, pendiente, hecho
6. bitacora/DECISIONS.md         ← decisiones arquitectónicas no obvias
```

Después de los 6 archivos anteriores, ya sabés:
- En qué fase y módulo estamos
- Qué se hizo antes y por qué
- Cuál es el próximo prompt a ejecutar

## Cómo identificar el siguiente prompt

`bitacora/STATE.md` siempre tiene la línea **`Próximo módulo a ejecutar:`**. Esa ruta apunta directo al archivo a abrir, ej:

```
Próximo módulo a ejecutar: prompts/01-fase-auth/04-supabase-client.md
```

Abrí ese archivo y seguí su estructura (Objetivo → Pre-requisitos → Contexto → Tareas → Validación → Cierre).

## Si el próximo módulo está marcado como BLOCKED

`bitacora/STATE.md` puede tener una sección `## Blocker` con descripción del problema. Pasos:

1. Leer la descripción del blocker
2. Si podés resolverlo (ej. faltan credenciales, falta decisión del usuario), preguntar al usuario o resolver según corresponda
3. **No saltar el módulo bloqueado.** El orden es estricto.
4. Si el blocker se resuelve, actualizar `STATE.md` quitando la sección `## Blocker` y proceder

## Cómo cerrar un módulo (proceso estándar)

Después de completar las tareas del módulo y pasar la validación:

### Paso A — Actualizar `bitacora/CHANGELOG.md`
Agregar al final:

```markdown
## [01.04] 2026-MM-DD — Supabase client + schema + RLS
- ✅ Project Supabase creado en region X
- ✅ Schema corrido (8 tablas)
- ✅ RLS policies aplicadas
- ✅ Cliente conectado en `app/lib/supabase.ts`
- 📁 Tocados: `app/lib/supabase.ts`, `app/supabase/schema.sql`, `app/supabase/policies.sql`, `app/.env.example`
- 🧠 Notas: trigger `handle_new_user` documentado en `app/supabase/schema.sql`
```

### Paso B — Actualizar `bitacora/STATE.md`
Reescribir el bloque de cabecera:

```markdown
**Última actualización:** 2026-MM-DD HH:MM (máquina: laptop-casa)
**Fase activa:** 01-fase-auth
**Último módulo completado:** 04-supabase-client
**Próximo módulo a ejecutar:** prompts/01-fase-auth/05-screen-login.md
```

### Paso C — Actualizar `bitacora/TASKS.md`
Mover la tarea correspondiente de `## En curso` a `## Done`. Mover la próxima de `## Pendiente` a `## En curso`.

### Paso D — Si cerraste la fase entera
Seguir las instrucciones del módulo `99-close-phase.md` de esa fase: smoke test E2E, git commit, plantilla de prompt para arrancar la siguiente fase.

## Cómo arrancar trabajo desde otra máquina

Asumiendo que ya hiciste `git clone` o `git pull` en la nueva máquina:

```bash
cd f:/proyectos_2026/WallaTeam/WallaTeam   # o equivalente
git pull
```

Después seguí el "Orden de lectura obligatorio" de arriba. La bitácora te dice exactamente desde dónde retomar.

**Importante para sync:**
- `app/.env` NO está en git (tiene secrets). Copiá tu `.env` local entre máquinas vía canal seguro o usá `.env.example` para reconstruir manualmente.
- `app/node_modules/` NO está en git. Correr `cd app && npm install` (o `pnpm install`) en cada máquina la primera vez.
- Si el `.env` cambió (ej. nuevo proyecto Supabase), actualizar también `bitacora/DECISIONS.md`.

## Reglas para preguntar al usuario

Solo preguntar cuando:
- Falta información que no está en el handoff ni en bitácora (ej. credenciales OAuth, claves de API)
- Una decisión arquitectónica no documentada cambia la dirección del prompt
- Encontraste discrepancia entre lo que dice el prompt y la realidad del repo (probable que algo se rompió)

**No preguntar cuando** la respuesta está en `00-MASTER.md`, `STATE.md` o el prompt del módulo. Releé antes de preguntar.

## Anti-patrones (qué NUNCA hacer)

- ❌ Empezar a codear sin leer la bitácora
- ❌ Saltarse fases o módulos
- ❌ Cambiar tokens / colores / microcopy "porque queda mejor" sin documentarlo
- ❌ Inventar componentes que ya existen en el handoff
- ❌ Olvidar actualizar `STATE.md` al terminar
- ❌ Hacer commits que mezclan múltiples módulos
- ❌ Modificar `design_handoff_wallateam_mvp/` (es read-only ground truth)

## Checklist de retoma rápida (TL;DR)

```
[ ] Leí 00-AGENT-HANDOFF.md (este archivo)
[ ] Leí 00-MASTER.md
[ ] Leí bitacora/STATE.md → sé qué módulo sigue
[ ] Leí bitacora/CHANGELOG.md → sé qué se hizo antes
[ ] Leí bitacora/TASKS.md → sé qué está en curso
[ ] Leí bitacora/DECISIONS.md → conozco las decisiones no obvias
[ ] Abrí el prompt del próximo módulo
[ ] Leí el prompt entero antes de tocar código
[ ] Ejecuté las tareas en orden
[ ] Pasé la validación
[ ] Actualicé CHANGELOG, STATE, TASKS
[ ] Si cerré la fase: corrí close-phase.md y commit
```

---

**Última actualización del HANDOFF:** 2026-04-28
