import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { text } from '@/theme/typography';

export default function Index() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        gap: 8,
      }}
    >
      <Text style={[text.regular, { color: theme.colors.textPrimary, fontSize: 16 }]}>
        Inter Regular 400
      </Text>
      <Text style={[text.medium, { color: theme.colors.textPrimary, fontSize: 16 }]}>
        Inter Medium 500
      </Text>
      <Text style={[text.semibold, { color: theme.colors.textPrimary, fontSize: 16 }]}>
        Inter SemiBold 600
      </Text>
      <Text style={[text.bold, { color: theme.colors.textPrimary, fontSize: 22 }]}>
        Inter Bold 700
      </Text>
      <Text style={[text.regular, { color: theme.colors.textSecondary, marginTop: 16, fontSize: 12 }]}>
        mode: {theme.mode} · primary: {theme.colors.primary}
      </Text>
    </View>
  );
}
