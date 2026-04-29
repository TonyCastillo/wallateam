import { ReactNode } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from './Icon';
import { typography } from '@/theme/tokens';

interface Props extends TextInputProps {
  label: string;
  iconName?: IconName;
  trailing?: ReactNode;
  labelTrailing?: ReactNode;
  error?: string;
}

export function Input({ label, iconName, trailing, labelTrailing, error, style, ...rest }: Props) {
  const { theme } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.textSecondary,
              fontFamily: typography.fontFamily.semibold,
              marginBottom: 0,
            },
          ]}
        >
          {label}
        </Text>
        {labelTrailing}
      </View>
      <View
        style={[
          styles.box,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
          },
        ]}
      >
        {iconName && <Icon name={iconName} size={18} color={theme.colors.textSecondary} />}
        <TextInput
          {...rest}
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            {
              flex: 1,
              fontSize: 14,
              color: theme.colors.textPrimary,
              fontFamily: typography.fontFamily.regular,
              padding: 0,
            },
            style,
          ]}
        />
        {trailing}
      </View>
      {error ? (
        <Text style={{ color: theme.colors.danger, fontSize: 11, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
