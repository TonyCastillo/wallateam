import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { IconBox, withAlpha } from './IconBox';
import { Button } from './Button';
import { Icon } from './Icon';

type Variant = 'no-members' | 'no-expenses' | 'all-settled';

interface Props {
  variant: Variant;
  onInvite?: () => void;
}

export function EmptyBalance({ variant, onInvite }: Props) {
  const { theme } = useTheme();

  if (variant === 'all-settled') {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 16 }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: withAlpha(theme.colors.accent, 0.15),
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: withAlpha(theme.colors.accent, 0.3),
        }}>
          <Icon name="Check" size={40} color={theme.colors.accent} strokeWidth={3} />
        </View>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 20, color: theme.colors.textPrimary, textAlign: 'center', letterSpacing: -0.5 }}>
            ¡Todo saldado!
          </Text>
          <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            Nadie debe nada al resto del grupo.
          </Text>
        </View>
      </View>
    );
  }

  if (variant === 'no-expenses') {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 16 }}>
        <IconBox iconName="Receipt" size={64} color={theme.colors.primary} />
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 18, color: theme.colors.textPrimary, textAlign: 'center', letterSpacing: -0.5 }}>
            Sin gastos
          </Text>
          <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            Todavía no hay gastos en este grupo.{'\n'}Cargá el primer gasto y vas a ver acá quién debe a quién.
          </Text>
        </View>
      </View>
    );
  }

  if (variant === 'no-members') {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 16 }}>
        <IconBox iconName="Users" size={64} color={theme.colors.primary} />
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 18, color: theme.colors.textPrimary, textAlign: 'center', letterSpacing: -0.5 }}>
            Empezá a compartir
          </Text>
          <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            Invitá al menos a un miembro para empezar a registrar gastos compartidos y calcular deudas.
          </Text>
        </View>
        <Button
          label="Invitar al grupo"
          iconLeft="UserPlus"
          variant="primary"
          onPress={onInvite}
          style={{ marginTop: 8 }}
        />
      </View>
    );
  }

  return null;
}
