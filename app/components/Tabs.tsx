import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

export interface TabItem<T extends string> {
  key: T;
  label: string;
  disabled?: boolean;
}

interface Props<T extends string> {
  items: TabItem<T>[];
  active: T;
  onChange: (k: T) => void;
}

export function Tabs<T extends string>({ items, active, onChange }: Props<T>) {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      {items.map((it) => {
        const isActive = it.key === active;
        const color = it.disabled
          ? theme.colors.textSecondary
          : isActive
            ? theme.colors.primary
            : theme.colors.textSecondary;
        const opacity = it.disabled ? 0.4 : 1;
        return (
          <Pressable
            key={it.key}
            onPress={() => !it.disabled && onChange(it.key)}
            disabled={it.disabled}
            style={[
              styles.item,
              {
                borderBottomColor: isActive ? theme.colors.primary : 'transparent',
                opacity,
              },
            ]}
          >
            <Text
              style={{
                color,
                fontSize: 14,
                fontFamily: typography.fontFamily.semibold,
              }}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    marginBottom: -1,
  },
});
