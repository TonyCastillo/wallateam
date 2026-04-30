import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { IconBox } from './IconBox';
import { Button } from './Button';

interface Props {
  /** Si se provee, el botón "Agregar gasto" navega con walletId precargado */
  walletId?: string;
}

export function EmptyExpenses({ walletId }: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const target = walletId ? `/expense/new?walletId=${walletId}` : '/expense/new';
  return (
    <View
      style={{
        alignItems: 'center',
        gap: 12,
        paddingVertical: 32,
        paddingHorizontal: 24,
      }}
    >
      <IconBox iconName="Receipt" color={theme.colors.textSecondary} size={64} bgOpacity={0.1} />
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: 16,
          fontFamily: typography.fontFamily.semibold,
        }}
      >
        Todavía no hay gastos
      </Text>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: 13,
          fontFamily: typography.fontFamily.regular,
          textAlign: 'center',
          maxWidth: 280,
        }}
      >
        Cuando agregues un gasto aparecerá acá
      </Text>
      <Button
        variant="outline"
        label="Agregar gasto"
        iconLeft="Plus"
        onPress={() => router.push(target)}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}
