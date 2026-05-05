import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface ChipProps {
  label: string;
  tone?: 'primary' | 'secondary' | 'success' | 'danger';
}

export function Chip({ label, tone = 'primary' }: ChipProps) {
  const { theme } = useTheme();

  let bgColor = theme.colors.chipBg;
  let textColor = theme.colors.primary;

  if (tone === 'secondary') {
    bgColor = theme.colors.chipBgBlue;
    textColor = theme.colors.secondary;
  } else if (tone === 'success') {
    bgColor = theme.colors.chipBg;
    textColor = theme.colors.success;
  } else if (tone === 'danger') {
    bgColor = theme.colors.chipBg;
    textColor = theme.colors.danger;
  }

  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: bgColor,
        alignSelf: 'flex-end',
        marginLeft: 'auto',
      }}
    >
      <Text
        style={{
          color: textColor,
          fontFamily: typography.fontFamily.semibold,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
