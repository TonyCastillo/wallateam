import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

interface QuickActionProps {
  iconName: IconName;
  label: string;
  variant: 'filled' | 'subtle';
  onPress: () => void;
}

export function QuickAction({ iconName, label, variant, onPress }: QuickActionProps) {
  const { theme } = useTheme();

  const isFilled = variant === 'filled';
  const bgColor = isFilled ? theme.colors.primary : theme.colors.surface;
  const iconColor = isFilled ? '#FFFFFF' : theme.colors.textPrimary;
  const borderColor = isFilled ? 'transparent' : theme.colors.border;

  return (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: 'center',
        gap: 6,
        width: 64,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={iconName} size={24} color={iconColor} />
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.medium,
          fontSize: 11,
          color: theme.colors.textPrimary,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
