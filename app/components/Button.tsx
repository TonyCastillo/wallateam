import { Pressable, Text, View, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from './Icon';
import { typography, gradients } from '@/theme/tokens';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  iconRight?: IconName;
  iconLeft?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  iconRight,
  iconLeft,
  loading,
  disabled,
  style,
}: Props) {
  const { theme } = useTheme();
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? '#fff' : theme.colors.textPrimary;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {iconLeft ? <Icon name={iconLeft} size={18} color={textColor} /> : null}
          <Text
            style={{
              color: textColor,
              fontFamily: typography.fontFamily.semibold,
              fontSize: 15,
            }}
          >
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={18} color={textColor} /> : null}
        </>
      )}
    </View>
  );

  if (isPrimary) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[{ borderRadius: 14 }, theme.shadows.ctaPrimary, style]}
      >
        <LinearGradient
          colors={[...gradients.ctaPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.btn,
            { borderRadius: 14, opacity: disabled ? 0.6 : 1 },
          ]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        {
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
