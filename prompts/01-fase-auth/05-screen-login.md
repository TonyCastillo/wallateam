# 05 — Screen Login / Registro + auth gate

## Objetivo
Portar fielmente [screen-login.jsx](../../design_handoff_wallateam_mvp/lib/screen-login.jsx) a React Native, conectarla a Supabase Auth (email + password), y montar el auth gate que redirige según sesión.

## Pre-requisitos
- Módulos 01-04 completados (Expo, theme, fonts, Supabase listos)

## Contexto necesario

Lectura obligatoria antes de escribir código:

- `prompts/00-MASTER.md` (todo, especialmente sección 4 tokens y sección 6 microcopy)
- `design_handoff_wallateam_mvp/lib/screen-login.jsx` (ground truth visual)
- `design_handoff_wallateam_mvp/lib/wallateam-ui.jsx` líneas 49 (WT_FONT), 65-140 (Icon), 143-168 (WTLogo)
- `design_handoff_wallateam_mvp/WallaTeam Prototype.html` abierto en browser para comparación visual (toggle dark mode con tweaks panel)

## Tareas

### 1. Crear schemas zod en `app/schemas/auth.ts`

```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/\d/, 'Debe contener al menos un número'),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Nombre muy corto').max(60, 'Nombre muy largo'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
```

### 2. Crear store Zustand `app/stores/auth.ts`

```ts
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  user: null,
  hydrated: false,
  hydrate: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, user: data.session?.user ?? null, hydrated: true });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
```

### 3. Crear `app/components/Icon.tsx` (wrapper lucide)

```tsx
import * as L from 'lucide-react-native';

export type IconName = keyof typeof L;

export function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.8 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const Cmp = L[name] as React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  if (!Cmp) return null;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}
```

### 4. Crear `app/components/WTLogo.tsx` (port SVG)

Port del SVG original ([wallateam-ui.jsx:143-168](../../design_handoff_wallateam_mvp/lib/wallateam-ui.jsx#L143-L168)) usando `react-native-svg`:

```tsx
import Svg, { Rect, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useId } from 'react';

interface Props {
  size?: number;
  color1?: string;
  color2?: string;
  color3?: string;
}

export function WTLogo({ size = 56, color1 = '#16A085', color2 = '#1F3A5F', color3 = '#2ECC71' }: Props) {
  const gid = `wt-${useId()}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={color3} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Rect x="6" y="20" width="52" height="36" rx="8" fill="none" stroke={`url(#${gid})`} strokeWidth="3" />
      <Path d="M58 32h-8a4 4 0 0 0 0 8h8" fill="none" stroke={color2} strokeWidth="3" strokeLinecap="round" />
      <Circle cx="51" cy="36" r="1.6" fill={color2} />
      <Path d="M16 28 L22 46 L28 34 L34 46 L40 28" fill="none" stroke={color2} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="14" cy="14" r="3.5" fill={color3} />
      <Circle cx="32" cy="11" r="3.5" fill={color2} />
      <Circle cx="50" cy="14" r="3.5" stroke={color1} strokeWidth="1" fill="#3B82F6" />
      <Path d="M14 17 L20 22 M32 14 L32 20 M50 17 L44 22" stroke={color2} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
```

### 5. Crear `app/components/RadialHero.tsx` (gradient radial del fondo)

```tsx
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

export function RadialHero({ color = '#16A085', width, height }: { color?: string; width: number; height: number }) {
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: -120, left: 0 }} pointerEvents="none">
      <Defs>
        <RadialGradient id="hero" cx="50%" cy="40%" rx="60%" ry="60%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="70%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#hero)" />
    </Svg>
  );
}
```

### 6. Crear `app/components/Input.tsx` (WTField port)

```tsx
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from './Icon';
import { typography } from '@/theme/tokens';

interface Props extends TextInputProps {
  label: string;
  iconName: IconName;
  trailing?: ReactNode;
  error?: string;
}

export function Input({ label, iconName, trailing, error, style, ...rest }: Props) {
  const { theme } = useTheme();
  return (
    <View>
      <Text style={[styles.label, { color: theme.colors.textSecondary, fontFamily: typography.fontFamily.semibold }]}>
        {label}
      </Text>
      <View style={[styles.box, { backgroundColor: theme.colors.surface, borderColor: error ? theme.colors.danger : theme.colors.border }]}>
        <Icon name={iconName} size={18} color={theme.colors.textSecondary} />
        <TextInput
          {...rest}
          placeholderTextColor={theme.colors.textSecondary}
          style={[{ flex: 1, fontSize: 14, color: theme.colors.textPrimary, fontFamily: typography.fontFamily.regular, padding: 0 }, style]}
        />
        {trailing}
      </View>
      {error ? <Text style={{ color: theme.colors.danger, fontSize: 11, marginTop: 4 }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' },
  box: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1,
  },
});
```

### 7. Crear `app/components/Button.tsx` (CTA primary gradient)

```tsx
import { Pressable, Text, View, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from './Icon';
import { typography, gradients } from '@/theme/tokens';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', iconRight, loading, disabled, style }: Props) {
  const { theme } = useTheme();
  const isPrimary = variant === 'primary';

  const content = (
    <View style={styles.row}>
      {loading ? <ActivityIndicator color={isPrimary ? '#fff' : theme.colors.textPrimary} /> : (
        <>
          <Text style={{ color: isPrimary ? '#fff' : theme.colors.textPrimary, fontFamily: typography.fontFamily.semibold, fontSize: 15 }}>
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={18} color={isPrimary ? '#fff' : theme.colors.textPrimary} /> : null}
        </>
      )}
    </View>
  );

  if (isPrimary) {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading} style={[{ borderRadius: 14 }, theme.shadows.ctaPrimary, style]}>
        <LinearGradient
          colors={[...gradients.ctaPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, { borderRadius: 14, opacity: disabled ? 0.6 : 1 }]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled || loading}
      style={[styles.btn, { borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background }, style]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
```

### 8. Crear `app/(auth)/_layout.tsx`

```tsx
import { Stack } from 'expo-router';
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

### 9. Crear `app/(auth)/login.tsx`

```tsx
import { View, Text, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform, useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { WTLogo } from '@/components/WTLogo';
import { RadialHero } from '@/components/RadialHero';
import { loginSchema, signupSchema, LoginInput, SignupInput } from '@/schemas/auth';
import { supabase } from '@/lib/supabase';

type Tab = 'login' | 'signup';

export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>('login');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const schema = tab === 'login' ? loginSchema : signupSchema;
  const { control, handleSubmit, formState: { errors }, reset } = useForm<SignupInput>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '', password: '', fullName: '' },
  });

  const onSubmit = async (values: SignupInput) => {
    setSubmitting(true);
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { full_name: values.fullName } },
        });
        if (error) throw error;
      }
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Algo salió mal');
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (next: Tab) => { setTab(next); reset(); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <RadialHero color={theme.colors.primary} width={width} height={360} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header logo + título */}
          <View style={styles.header}>
            <WTLogo size={68} />
            <View style={{ alignItems: 'center', marginTop: 14 }}>
              <Text style={{ fontSize: 26, fontFamily: typography.fontFamily.bold, letterSpacing: -0.5 }}>
                <Text style={{ color: theme.colors.secondary }}>Walla</Text>
                <Text style={{ color: theme.colors.primary }}>Team</Text>
              </Text>
              <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, fontFamily: typography.fontFamily.regular }}>
                Gastos compartidos, sin enredos.
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={[styles.tabs, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {(['login', 'signup'] as const).map(t => {
              const active = tab === t;
              return (
                <Pressable key={t} onPress={() => switchTab(t)}
                  style={[styles.tabItem, { backgroundColor: active ? theme.colors.background : 'transparent' }, active && theme.shadows.card]}>
                  <Text style={{ color: active ? theme.colors.primary : theme.colors.textSecondary, fontSize: 13, fontFamily: typography.fontFamily.semibold }}>
                    {t === 'login' ? 'Ingresar' : 'Registrarme'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {tab === 'signup' && (
              <Controller control={control} name="fullName" render={({ field: { value, onChange, onBlur } }) => (
                <Input label="Nombre" iconName="User" value={value} onChangeText={onChange} onBlur={onBlur}
                  autoCapitalize="words" placeholder="Tu nombre" error={errors.fullName?.message as string | undefined} />
              )} />
            )}

            <Controller control={control} name="email" render={({ field: { value, onChange, onBlur } }) => (
              <Input label="Email" iconName="Mail" value={value} onChangeText={onChange} onBlur={onBlur}
                autoCapitalize="none" autoComplete="email" keyboardType="email-address"
                placeholder="tu@email.com" error={errors.email?.message as string | undefined} />
            )} />

            <Controller control={control} name="password" render={({ field: { value, onChange, onBlur } }) => (
              <Input label="Contraseña" iconName="Lock" value={value} onChangeText={onChange} onBlur={onBlur}
                secureTextEntry={!showPass} placeholder="••••••••" error={errors.password?.message as string | undefined}
                trailing={
                  <Pressable onPress={() => setShowPass(s => !s)} hitSlop={10}>
                    <Icon name={showPass ? 'Eye' : 'EyeOff'} size={18} color={theme.colors.textSecondary} />
                  </Pressable>
                }
              />
            )} />

            {tab === 'login' && (
              <Pressable onPress={() => Alert.alert('Recuperar', 'Próximamente')} style={{ alignSelf: 'flex-end' }}>
                <Text style={{ color: theme.colors.primary, fontSize: 12, fontFamily: typography.fontFamily.semibold }}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>
            )}

            <Button
              label={tab === 'login' ? 'Ingresar' : 'Crear mi cuenta'}
              iconRight="ArrowRight"
              loading={submitting}
              onPress={handleSubmit(onSubmit)}
              style={{ marginTop: 8 }}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.divLine, { backgroundColor: theme.colors.border }]} />
              <Text style={{ color: theme.colors.textSecondary, fontSize: 11, fontFamily: typography.fontFamily.regular }}>o continuar con</Text>
              <View style={[styles.divLine, { backgroundColor: theme.colors.border }]} />
            </View>

            <Button
              label="Google"
              variant="outline"
              onPress={() => Alert.alert('Google', 'Próximamente — Fase 1.5')}
            />
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingBottom: 20, paddingTop: 12 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, fontFamily: typography.fontFamily.regular }}>
              {tab === 'login' ? '¿Nuevo en WallaTeam? ' : '¿Ya tenés cuenta? '}
              <Text onPress={() => switchTab(tab === 'login' ? 'signup' : 'login')}
                style={{ color: theme.colors.primary, fontFamily: typography.fontFamily.semibold }}>
                {tab === 'login' ? 'Crear cuenta' : 'Ingresá'}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 28, paddingTop: 36, alignItems: 'center' },
  tabs: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 14, borderWidth: 1, marginHorizontal: 24, marginTop: 32 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  form: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, gap: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  divLine: { flex: 1, height: 1 },
});
```

### 10. Crear `app/(app)/_layout.tsx` (placeholder protegido)

```tsx
import { Stack } from 'expo-router';
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

### 11. Crear `app/(app)/index.tsx` placeholder con logout

```tsx
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { typography } from '@/theme/tokens';

export default function Home() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ color: theme.colors.textPrimary, fontFamily: typography.fontFamily.bold, fontSize: 22 }}>
        Hola, {user?.user_metadata?.full_name ?? user?.email}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontFamily: typography.fontFamily.regular }}>
        Placeholder home — Fase 2 reemplaza esto
      </Text>
      <Pressable onPress={signOut} style={{ marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, backgroundColor: theme.colors.danger }}>
        <Text style={{ color: '#fff', fontFamily: typography.fontFamily.semibold }}>Cerrar sesión</Text>
      </Pressable>
    </SafeAreaView>
  );
}
```

### 12. Reescribir `app/_layout.tsx` con auth gate

```tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';

SplashScreen.preventAutoHideAsync().catch(() => {});

function StatusBarWithTheme() {
  const { theme } = useTheme();
  return <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />;
}

function AuthGate() {
  const segments = useSegments();
  const router = useRouter();
  const { session, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) router.replace('/(auth)/login');
    else if (session && inAuth) router.replace('/(app)');
  }, [session, hydrated, segments]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const hydrate = useAuth(s => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBarWithTheme />
        <AuthGate />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

### 13. Borrar el `app/index.tsx` raíz que era placeholder
Ahora ya no es necesario (el auth gate redirige a `(auth)/login` o `(app)`). Si querés dejarlo, que solo retorne `null` o un loader.

```tsx
import { View } from 'react-native';
export default function Index() { return <View style={{ flex: 1 }} />; }
```

## Validación

Smoke test manual completo:

1. **Sin sesión** → al abrir, redirige a `/login`
2. **Visual**: comparar lado a lado contra el mock en navegador. Verificar:
   - Logo WTLogo a 68px en el centro
   - "Walla" secondary + "Team" primary
   - Tagline correcto
   - Tabs Ingresar / Registrarme con shadow en activo
   - 3 inputs en signup, 2 en login
   - Eye toggle alterna iconos `Eye` / `EyeOff`
   - CTA con gradient 135° teal→azul + sombra teal
   - Divider "o continuar con"
   - Google button outline
3. **Validación**: tocar Ingresar con campos vacíos → mensajes zod debajo de cada input
4. **Signup**: nombre + email nuevo + password 8+ chars con número → crea user → redirige a placeholder home → en Supabase Dashboard ver row en `auth.users` y `profiles`
5. **Logout**: tocar "Cerrar sesión" → redirige a /login
6. **Login** con el mismo email → vuelve a home
7. **Persistencia**: cerrar Expo Go (force quit) → reabrir → sigue logueado
8. **Dark mode**: cambiar tema del OS → la pantalla respeta dark
9. `npx tsc --noEmit` sin errores

## Cierre

### Entry `bitacora/CHANGELOG.md`
```markdown
## [01.05] 2026-MM-DD — Pantalla Login/Registro + auth gate
- ✅ Schemas zod (login, signup) en `app/schemas/auth.ts`
- ✅ Store auth (Zustand) con hydrate + signOut + listener auth state
- ✅ Componentes: Icon (lucide), WTLogo (svg), RadialHero (svg), Input (WTField port), Button (gradient + outline)
- ✅ Pantalla `(auth)/login.tsx` con tabs, validación, eye toggle, CTA gradient, Google placeholder
- ✅ `(app)/index.tsx` placeholder con logout
- ✅ Auth gate en `_layout.tsx` redirige según sesión, hydrate al inicio
- 📁 Tocados: `app/schemas/auth.ts`, `app/stores/auth.ts`, `app/components/{Icon,WTLogo,RadialHero,Input,Button}.tsx`, `app/(auth)/{_layout,login}.tsx`, `app/(app)/{_layout,index}.tsx`, `app/_layout.tsx`
- 🧪 Verificación: signup nuevo → row en profiles → logout → login → reabrir app → sigue logueado
```

### Update `STATE.md`
- **Último módulo completado:** 05-screen-login
- **Próximo módulo a ejecutar:** prompts/01-fase-auth/06-validate-vs-mock.md
