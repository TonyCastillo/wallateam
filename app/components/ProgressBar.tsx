import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  value: number; // 0..1, se clampa
  tint?: string;
  bg?: string;
  height?: number;
}

export function ProgressBar({ value, tint, bg, height = 6 }: Props) {
  const { theme } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View
      style={{
        height,
        borderRadius: 999,
        backgroundColor: bg ?? theme.colors.surfaceAlt,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          backgroundColor: tint ?? theme.colors.primary,
          borderRadius: 999,
        }}
      />
    </View>
  );
}
