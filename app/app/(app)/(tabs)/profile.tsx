import { Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { typography } from '@/theme/tokens';

export default function Profile() {
  const { theme } = useTheme();
  const { signOut } = useAuth();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: typography.fontFamily.regular,
        }}
      >
        Perfil — Fase 1.5/8
      </Text>

      <Pressable
        onPress={signOut}
        style={{
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
