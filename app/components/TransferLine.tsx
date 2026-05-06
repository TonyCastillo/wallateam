import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { fmtGs } from '@/lib/format';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { withAlpha } from './IconBox';

interface Props {
  fromName: string;
  toName: string;
  amount: number;
  isCurrentUserInvolved?: boolean;
  onSettle?: () => void;
}

export function TransferLine({ fromName, toName, amount, isCurrentUserInvolved, onSettle }: Props) {
  const { theme } = useTheme();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: isCurrentUserInvolved ? theme.colors.accent : theme.colors.border,
      gap: 12,
      marginBottom: 8,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Avatar name={fromName} size={24} />
        <Icon name="ArrowRight" size={14} color={theme.colors.textSecondary} />
        <Avatar name={toName} size={24} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: typography.fontFamily.medium,
          fontSize: 12,
          color: theme.colors.textPrimary,
        }}>
          {fromName} debe <Text style={{ fontFamily: typography.fontFamily.bold }}>{fmtGs(amount)}</Text> a {toName}
        </Text>
      </View>
      {isCurrentUserInvolved && (
        <Pressable
          onPress={onSettle}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: withAlpha(theme.colors.accent, 0.1),
          }}
        >
          <Text style={{
            fontFamily: typography.fontFamily.semibold,
            fontSize: 11,
            color: theme.colors.accent,
          }}>
            Saldar
          </Text>
        </Pressable>
      )}
    </View>
  );
}
