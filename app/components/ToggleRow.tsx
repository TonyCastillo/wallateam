import { View, Text, Switch, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon, IconName } from './Icon';

interface ToggleRowProps {
  iconName: IconName;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  children?: React.ReactNode;
}

export function ToggleRow({ iconName, label, subtitle, value, onValueChange, children }: ToggleRowProps) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      <Pressable
        onPress={() => onValueChange(!value)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Icon name={iconName} size={24} color={theme.colors.textSecondary} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: 16, color: theme.colors.textPrimary }}>
            {label}
          </Text>
          {subtitle && (
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
              {subtitle}
            </Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor="#FFFFFF"
        />
      </Pressable>
      {value && children && (
        <View style={{ marginTop: 12, paddingLeft: 36 }}>
          {children}
        </View>
      )}
    </View>
  );
}
