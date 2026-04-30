import { View, Text, TextInput } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface Props {
  value: number;
  onChange: (n: number) => void;
  symbolSize?: number;  // 22 default
  numberSize?: number;  // 36 default
  placeholder?: string;
  autoFocus?: boolean;
}

export function AmountInput({
  value, onChange,
  symbolSize = 22, numberSize = 36,
  placeholder = '0', autoFocus,
}: Props) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.semibold,
          fontSize: symbolSize,
          color: theme.colors.textSecondary,
        }}
      >
        ₲
      </Text>
      <TextInput
        autoFocus={autoFocus}
        style={{
          flex: 1,
          fontFamily: typography.fontFamily.bold,
          fontSize: numberSize,
          color: theme.colors.textPrimary,
          padding: 0,
          letterSpacing: -1,
        }}
        keyboardType="numeric"
        value={value === 0 ? '' : value.toLocaleString('es-PY')}
        onChangeText={(t) => {
          const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
          onChange(isNaN(n) ? 0 : n);
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  );
}
