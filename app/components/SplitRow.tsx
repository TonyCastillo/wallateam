import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Avatar } from './Avatar';
import { LinearGradient } from 'expo-linear-gradient';

const formatPYG = (n: number) => n.toLocaleString('es-PY');

interface SplitRowProps {
  name: string;
  pct: number;
  amount: number;
  isIncluded?: boolean;
  onToggle?: () => void;
  // Props para módulos futuros (percent, amount):
  // mode?: 'equal' | 'percent' | 'amount';
  // onChangeAmount?: (amt: number) => void;
  // onChangePct?: (pct: number) => void;
}

export function SplitRow({ name, pct, amount, isIncluded = true, onToggle }: SplitRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      disabled={!onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        opacity: isIncluded ? 1 : 0.4,
      }}
    >
      <Avatar name={name} size={32} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semibold,
            fontSize: 13,
            color: theme.colors.textPrimary,
          }}
        >
          {name}
        </Text>
        <View
          style={{
            height: 5,
            marginTop: 5,
            borderRadius: 3,
            backgroundColor: theme.colors.background,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, height: '100%' }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, minWidth: 70, justifyContent: 'flex-end' }}>
        <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 16, color: theme.colors.textPrimary }}>
          {Number(pct.toFixed(1))}
        </Text>
        <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 11, color: theme.colors.textSecondary }}>
          %
        </Text>
      </View>
      <View style={{ minWidth: 64, alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary }}>
          {amount > 0 ? formatPYG(Math.round(amount)) : '0'}
        </Text>
      </View>
    </Pressable>
  );
}
