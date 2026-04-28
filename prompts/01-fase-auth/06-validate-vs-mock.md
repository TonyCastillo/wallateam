# 06 — Validación visual contra el prototipo

## Objetivo
Comparar la pantalla de login implementada contra `WallaTeam Prototype.html` lado a lado, capturar discrepancias y resolverlas o documentarlas. Match objetivo: **≥ 95%** visual + **100%** microcopy.

## Pre-requisitos
- Módulo 05 completado (login funcional en Expo Go)

## Contexto necesario
- `design_handoff_wallateam_mvp/WallaTeam Prototype.html` abierto en navegador
- Expo Go corriendo con la app

## Tareas

### 1. Setup de comparación

- Abrir `WallaTeam Prototype.html` en Chrome/Edge (doble clic en el archivo) → seleccionar pestaña **01 · Login / Registro**
- Tener Expo Go en pantalla con la pantalla de Login
- Toggle del prototipo: probar **light** y **dark** mode (panel de tweaks lateral)

### 2. Checklist visual — light mode

Marcar cada uno como ✅ / ⚠ / ❌:

- [ ] Logo WTLogo a 68px, posición y proporciones idénticas
- [ ] Color de "Walla" = `#1F3A5F`, color de "Team" = `#16A085` (en dark, "Walla" usa `#5DA9E9`)
- [ ] Tagline "Gastos compartidos, sin enredos." en `textSecondary` 13px
- [ ] Tabs: container `borderRadius:14, padding:4`, items `borderRadius:10, padding:10v`
- [ ] Tab activo: bg `background`, color `primary`, sombra suave
- [ ] Tab inactivo: transparente, color `textSecondary`
- [ ] Inputs: label uppercase 11px weight 600 letterSpacing 0.3
- [ ] Input box: bg `surface`, borderRadius 12, border 1, gap 10 entre icon/text
- [ ] Iconos input a 18px, color `textSecondary`
- [ ] Eye toggle a la derecha del password
- [ ] Forgot password 12px weight 600, color `primary`, alineado a la derecha (solo en login tab)
- [ ] CTA: gradient 135° teal → azul, padding 14, borderRadius 14
- [ ] Sombra del CTA visible: teal con opacity 0.30
- [ ] Icono `arrow-right` a la derecha del label CTA
- [ ] Divider con "o continuar con" 11px `textSecondary`, líneas 1px border
- [ ] Google button outline 14px medium con icono Google
- [ ] Bottom switch: "¿Nuevo en WallaTeam? **Crear cuenta**" 12px

### 3. Checklist visual — dark mode

Cambiar tema OS o el toggle del ThemeProvider:

- [ ] Background `#0E1B2C`
- [ ] Surfaces (inputs, tabs container) `#15263C`
- [ ] Border `#243B58`
- [ ] textPrimary `#ECF0F1`, textSecondary `#9AA8B6`
- [ ] "Walla" en `#5DA9E9` (cambia respecto a light)
- [ ] CTA gradient sigue 135° teal → azul (los stops no cambian, lo que cambia es el contraste con bg)
- [ ] Sombras casi imperceptibles pero correctas (`elevHi`)

### 4. Checklist microcopy (debe ser **100% match**)

- [ ] "Ingresar"
- [ ] "Registrarme"
- [ ] "Nombre"
- [ ] "Email"
- [ ] "Contraseña"
- [ ] "¿Olvidaste tu contraseña?"
- [ ] "Crear mi cuenta" (en signup) / "Ingresar" (en login)
- [ ] "o continuar con"
- [ ] "Google"
- [ ] "¿Nuevo en WallaTeam? Crear cuenta"
- [ ] "¿Ya tenés cuenta? Ingresá"
- [ ] "Gastos compartidos, sin enredos."

### 5. Checklist interactivo

- [ ] Tap en tab cambia el formulario sin lag visible
- [ ] Eye toggle alterna entre `EyeOff` y `Eye`
- [ ] Password sigue masked al cambiar de tab
- [ ] Validación zod muestra mensajes en español
- [ ] Loading spinner aparece al tocar CTA
- [ ] Errores Supabase llegan en `Alert.alert` con mensaje legible

### 6. Resolver discrepancias

Para cada item con ⚠ o ❌:

- Si el fix es trivial (color, padding, microcopy) → corregir y re-validar
- Si el fix requiere cambiar arquitectura (ej. radial gradient impreciso por limitaciones RN) → documentar en `bitacora/DECISIONS.md` con:
  - Qué se desvía
  - Por qué (limitación técnica)
  - Cómo se mitiga (alternativa elegida)

### 7. Capturas comparativas (opcional pero recomendado)

- Tomar screenshot del Expo Go (con device frame si querés con `expo-screen-capture`)
- Tomar screenshot del prototipo HTML (botón derecho → guardar)
- Guardar en `bitacora/screenshots/01.05-login-{light,dark}.png` (gitignored para no inflar el repo, pero compartibles vía Drive/Dropbox)

## Validación

- ≥ 95% de items del checklist marcados como ✅
- 100% del checklist de microcopy ✅
- Todas las desviaciones documentadas en `DECISIONS.md`

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [01.06] 2026-MM-DD — Validación visual login vs prototipo
- ✅ Checklist visual light: X/Y ítems OK
- ✅ Checklist visual dark: X/Y ítems OK
- ✅ Microcopy: 12/12 match
- ✅ Interactivos: 6/6 OK
- 🧠 Desviaciones documentadas en DECISIONS.md (si hubo)
- 📁 Tocados: (solo correcciones de fix aplicadas en módulo 05)
```

### Update `STATE.md`
- **Último módulo completado:** 06-validate-vs-mock
- **Próximo módulo a ejecutar:** prompts/01-fase-auth/99-close-phase.md
