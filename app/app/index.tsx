import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

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
      <Text style={{ color: theme.colors.textPrimary, fontSize: 18 }}>WallaTeam</Text>
      <Text style={{ color: theme.colors.textSecondary }}>primary: {theme.colors.primary}</Text>
      <Text style={{ color: theme.colors.textSecondary }}>secondary: {theme.colors.secondary}</Text>
      <Text style={{ color: theme.colors.textSecondary }}>mode: {theme.mode}</Text>
    </View>
  );
}
