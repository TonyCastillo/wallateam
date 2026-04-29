import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

export default function Stats() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: typography.fontFamily.regular,
        }}
      >
        Resumen — Fase 8
      </Text>
    </SafeAreaView>
  );
}
