# WallaTeam — Design System (React Native Ready)

Este documento traduce el branding a **tokens + estilos reutilizables** para implementación directa en React Native.

---

## 🧱 1. Design Tokens

### 🎨 Colors (Theme)
```ts
export const colors = {
  primary: '#16A085',
  primaryDark: '#138D75',
  secondary: '#1F3A5F',
  accent: '#2ECC71',

  background: '#FFFFFF',
  surface: '#F8F9FA',

  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',

  border: '#E5E7EB',
  danger: '#E74C3C',
  warning: '#F39C12',
  success: '#2ECC71'
}
```

---

### 🔤 Typography
```ts
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold'
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28
  },

  lineHeight: {
    sm: 18,
    base: 22,
    lg: 26
  }
}
```

---

### 📐 Spacing & Layout
```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
}

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24
}
```

---

### 🌑 Shadows
```ts
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
}
```

---

## 🧩 2. Core Components

### 🔘 Button
```ts
export const buttonStyles = {
  base: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },

  primary: {
    backgroundColor: colors.primary
  },

  text: {
    color: '#FFF',
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium
  }
}
```

---

### 🧾 Card (Gasto)
```ts
export const cardStyles = {
  container: {
    backgroundColor: '#FFF',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    ...shadows.card
  },

  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary
  },

  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary
  }
}
```

---

### 🧍 Avatar Grupo
```ts
export const avatarStyles = {
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    color: '#FFF',
    fontFamily: typography.fontFamily.semibold
  }
}
```

---

## 📱 3. Layout Patterns

### Screen Container
```ts
export const layout = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md
  }
}
```

---

### Header
```ts
export const headerStyles = {
  container: {
    paddingVertical: spacing.md
  },

  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary
  }
}
```

---

## 🧠 4. UX Rules

- CTA principal siempre visible (Agregar gasto)
- Máximo 1 acción primaria por pantalla
- Evitar sobrecarga visual
- Priorizar lectura rápida

---

## 🗣️ 5. Microcopy (Ready)

```ts
export const copy = {
  addExpense: 'Agregar gasto',
  inviteTeam: 'Invitar al equipo',
  emptyState: 'Todavía no hay gastos',
  groupBalance: 'Balance del grupo'
}
```

---

## 🚀 6. Ejemplo de uso

```tsx
<View style={layout.screen}>
  <Text style={headerStyles.title}>Mi Grupo</Text>

  <View style={cardStyles.container}>
    <Text style={cardStyles.title}>Supermercado</Text>
    <Text style={cardStyles.subtitle}>$120.000</Text>
  </View>

  <TouchableOpacity style={[buttonStyles.base, buttonStyles.primary]}>
    <Text style={buttonStyles.text}>Agregar gasto</Text>
  </TouchableOpacity>
</View>
```

---

## 🧩 Conclusión

Este design system está optimizado para:
- Implementación rápida en React Native
- Escalabilidad
- Consistencia visual

Podés extenderlo fácilmente con dark mode, temas dinámicos o integración con Tailwind (NativeWind).

