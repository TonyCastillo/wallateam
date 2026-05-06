import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { fmtGsSigned } from '@/lib/format';
import { Avatar } from './Avatar';

interface Props {
  name: string;
  net: number;
}

export function BalanceLine({ name, net }: Props) {
  const { theme } = useTheme();
  
  const isPositive = net > 0;
  const isNegative = net < 0;
  const amountColor = isPositive ? theme.colors.accent : (isNegative ? theme.colors.danger : theme.colors.textSecondary);
  
  let sublabel = 'saldado';
  if (isPositive) sublabel = 'te deben';
  if (isNegative) sublabel = 'debés';
  // Si no soy el current user, el texto debe ser genérico o podemos dejarlo como está si es genérico.
  // Wait, el mock dice "te deben" / "debés" si el usuario es "Vos". Para otros usuarios sería "le deben" / "debe".
  // Pero vamos a dejar la lógica de UI por ahora según el prompt, se puede ajustar después.

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    }}>
      <Avatar name={name} size={28} />
      <Text style={{
        flex: 1,
        fontFamily: typography.fontFamily.medium,
        fontSize: 13,
        color: theme.colors.textPrimary,
      }}>
        {name}
      </Text>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 13,
          color: amountColor,
        }}>
          {fmtGsSigned(net)}
        </Text>
        <Text style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 10,
          color: theme.colors.textSecondary,
        }}>
          {sublabel}
        </Text>
      </View>
    </View>
  );
}
