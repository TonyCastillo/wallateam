import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { WTLogo } from '@/components/WTLogo';
import { RadialHero } from '@/components/RadialHero';
import { loginSchema, signupSchema, SignupInput } from '@/schemas/auth';
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupInput>({
    resolver: zodResolver(schema) as unknown as Resolver<SignupInput>,
    defaultValues: { email: '', password: '', fullName: '' },
  });

  const onSubmit = async (values: SignupInput) => {
    setSubmitting(true);
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Algo salió mal';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    reset();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <RadialHero color={theme.colors.primary} width={width} height={360} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <WTLogo size={68} />
            <View style={{ alignItems: 'center', marginTop: 14 }}>
              <Text
                style={{
                  fontSize: 26,
                  fontFamily: typography.fontFamily.bold,
                  letterSpacing: -0.5,
                }}
              >
                <Text style={{ color: theme.colors.secondary }}>Walla</Text>
                <Text style={{ color: theme.colors.primary }}>Team</Text>
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                  fontFamily: typography.fontFamily.regular,
                }}
              >
                Gastos compartidos, sin enredos.
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View
            style={[
              styles.tabs,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            {(['login', 'signup'] as const).map((t) => {
              const active = tab === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => switchTab(t)}
                  style={[
                    styles.tabItem,
                    {
                      backgroundColor: active ? theme.colors.background : 'transparent',
                    },
                    active && theme.shadows.card,
                  ]}
                >
                  <Text
                    style={{
                      color: active ? theme.colors.primary : theme.colors.textSecondary,
                      fontSize: 13,
                      fontFamily: typography.fontFamily.semibold,
                    }}
                  >
                    {t === 'login' ? 'Ingresar' : 'Registrarme'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {tab === 'signup' && (
              <Controller
                control={control}
                name="fullName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    label="Nombre"
                    iconName="User"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                    placeholder="Tu nombre"
                    error={errors.fullName?.message}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Email"
                  iconName="Mail"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Contraseña"
                  iconName="Lock"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPass}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  trailing={
                    <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={10}>
                      <Icon
                        name={showPass ? 'Eye' : 'EyeOff'}
                        size={18}
                        color={theme.colors.textSecondary}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            {tab === 'login' && (
              <Pressable
                onPress={() => Alert.alert('Recuperar contraseña', 'Próximamente')}
                style={{ alignSelf: 'flex-end' }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 12,
                    fontFamily: typography.fontFamily.semibold,
                  }}
                >
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
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 11,
                  fontFamily: typography.fontFamily.regular,
                }}
              >
                o continuar con
              </Text>
              <View style={[styles.divLine, { backgroundColor: theme.colors.border }]} />
            </View>

            <Button
              label="Google"
              variant="outline"
              onPress={() => Alert.alert('Google', 'Próximamente — Fase 1.5')}
            />
          </View>

          <View style={{ flex: 1 }} />

          {/* Switch tab footer */}
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingBottom: 20,
              paddingTop: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.textSecondary,
                fontFamily: typography.fontFamily.regular,
              }}
            >
              {tab === 'login' ? '¿Nuevo en WallaTeam? ' : '¿Ya tenés cuenta? '}
              <Text
                onPress={() => switchTab(tab === 'login' ? 'signup' : 'login')}
                style={{
                  color: theme.colors.primary,
                  fontFamily: typography.fontFamily.semibold,
                }}
              >
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
  header: {
    paddingHorizontal: 28,
    paddingTop: 36,
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 32,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  divLine: {
    flex: 1,
    height: 1,
  },
});
