import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface Props {
  label: string;
  value: string;
  highlight?: boolean;
  /** Override de colores para uso sobre fondos no-theme (ej. header gradient) */
  labelColor?: string;
  valueColor?: string;
  align?: 'flex-start' | 'center' | 'flex-end';
}

export function Metric({ label, value, highlight, labelColor, valueColor, align = 'flex-start' }: Props) {
  const { theme } = useTheme();
  const lc = labelColor ?? theme.colors.textSecondary;
  const vc = valueColor ?? (highlight ? theme.colors.primary : theme.colors.textPrimary);
  return (
    <View style={{ gap: 4, alignItems: align }}>
      <Text
        style={{
          color: lc,
          fontSize: 11,
          fontFamily: typography.fontFamily.medium,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: vc,
          fontSize: 18,
          fontFamily: typography.fontFamily.bold,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
