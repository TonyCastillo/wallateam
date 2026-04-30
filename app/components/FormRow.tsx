import { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

interface FormRowProps {
  iconName: IconName;
  label: string;
  value: string | ReactNode;
  subValue?: string;
  chip?: { text: string; tone: 'primary' | 'secondary' };
  trailing?: ReactNode;
  onPress?: () => void;
  error?: string;
}

export function FormRow({
  iconName,
  label,
  value,
  subValue,
  chip,
  trailing,
  onPress,
  error,
}: FormRowProps) {
  const { theme } = useTheme();

  return (
    <View style={{ marginTop: 10 }}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 14,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={iconName} size={16} color={theme.colors.primary} />
        </View>

        {/* Content */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.semibold,
              fontSize: 10,
              color: theme.colors.textSecondary,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
            {typeof value === 'string' ? (
              <Text
                style={{
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: 13,
                  color: theme.colors.textPrimary,
                }}
                numberOfLines={1}
              >
                {value}
              </Text>
            ) : (
              value
            )}
            
            {chip && (
              <View
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  borderRadius: 5,
                  backgroundColor: chip.tone === 'primary' ? theme.colors.primary + '1A' : theme.colors.secondary + '1A',
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.bold,
                    fontSize: 9,
                    color: chip.tone === 'primary' ? theme.colors.primary : theme.colors.secondary,
                    letterSpacing: 0.3,
                  }}
                >
                  {chip.text}
                </Text>
              </View>
            )}

            {subValue && (
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 11,
                  color: theme.colors.textSecondary,
                }}
              >
                · {subValue}
              </Text>
            )}
          </View>
        </View>

        {/* Trailing */}
        {trailing !== undefined ? (
          trailing
        ) : onPress ? (
          <Icon name="ChevronRight" size={18} color={theme.colors.textSecondary} />
        ) : null}
      </Pressable>

      {/* Error */}
      {error && (
        <Text
          style={{
            marginTop: 4,
            marginLeft: 4,
            fontFamily: typography.fontFamily.medium,
            fontSize: 11,
            color: theme.colors.danger,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
