import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { typography } from '@/theme/tokens';

export default function Home() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? '';

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 24,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: typography.fontFamily.bold,
          fontSize: 22,
          textAlign: 'center',
        }}
      >
        Hola, {fullName}
      </Text>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: typography.fontFamily.regular,
          textAlign: 'center',
        }}
      >
        Placeholder home — Fase 2 reemplaza esta pantalla con tus wallets
      </Text>
      <Pressable
        onPress={signOut}
        style={{
          marginTop: 24,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 14,
          backgroundColor: theme.colors.danger,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontFamily: typography.fontFamily.semibold,
          }}
        >
          Cerrar sesión
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
