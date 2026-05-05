import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { anyCategoryById } from '@/lib/categories';
import { fmtGs, formatExpenseDate } from '@/lib/format';
import { IconBox } from './IconBox';
import { useAuth } from '@/stores/auth';
import { Expense } from '@/lib/types';

interface Props {
  expense: Expense;
  /** Nombre del payer; si se omite y `paid_by === currentUserId` muestra "Vos". */
  payerName?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function ExpenseRow({ expense, payerName, onPress, onLongPress }: Props) {
  const { theme } = useTheme();
  const isIncome = expense.kind === 'income';
  const cat = anyCategoryById(expense.category, expense.kind);
  const currentUserId = useAuth((s) => s.user?.id);
  const isMe = expense.paid_by === currentUserId;
  let actionText = '';
  if (isMe) {
    actionText = isIncome ? 'Cargado por vos' : 'Pagado por vos';
  } else {
    const actorName = payerName ?? 'Otro';
    actionText = isIncome ? `Cargó ${actorName}` : `Pagó ${actorName}`;
  }
  const amountColor = isIncome ? theme.colors.accent : theme.colors.textPrimary;
  const amountPrefix = isIncome ? '+' : '−';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={[
        styles.row,
        { backgroundColor: theme.colors.surface },
        theme.shadows.card,
      ]}
    >
      <IconBox iconName={cat.icon} color={cat.color} size={40} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontFamily: typography.fontFamily.semibold,
          }}
          numberOfLines={1}
        >
          {expense.description}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 12,
            fontFamily: typography.fontFamily.regular,
          }}
          numberOfLines={1}
        >
          {`${actionText} · ${formatExpenseDate(expense.occurred_at)}`}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text
          style={{
            color: amountColor,
            fontSize: 15,
            fontFamily: typography.fontFamily.semibold,
          }}
        >
          {`${amountPrefix} ${fmtGs(expense.amount)}`}
        </Text>
        {/* Fase 3: split_mode siempre 'equal' single-user → no se muestra chip. Fase 5 lo agregará. */}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
  },
});
