import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface AvatarProps {
  name: string;
  size?: number;
  bg?: string;
  ring?: boolean;
}

export function Avatar({ name, size = 36, bg, ring }: AvatarProps) {
  const { theme } = useTheme();
  
  const words = name.trim().split(/\s+/);
  let initials = '';
  if (words.length > 0 && words[0].length > 0) {
    initials += words[0][0].toUpperCase();
  }
  if (words.length > 1 && words[1].length > 0) {
    initials += words[1][0].toUpperCase();
  }

  const backgroundColor = bg || theme.colors.primary;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        ...(ring && {
          borderWidth: 2,
          borderColor: theme.colors.background,
        }),
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontFamily: typography.fontFamily.semibold,
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
