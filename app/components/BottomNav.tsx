import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { typography, shadows } from '@/theme/tokens';
import { Wallet, Activity, Plus, TrendingUp, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BottomNavProps {
  active: 'home' | 'activity' | 'add' | 'stats' | 'profile';
  onPress: (tab: 'home' | 'activity' | 'add' | 'stats' | 'profile') => void;
}

export function BottomNav({ active, onPress }: BottomNavProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const items = [
    { key: 'home', icon: Wallet, label: 'Inicio' },
    { key: 'activity', icon: Activity, label: 'Actividad' },
    { key: 'add', isFab: true },
    { key: 'stats', icon: TrendingUp, label: 'Resumen' },
    { key: 'profile', icon: User, label: 'Perfil' },
  ] as const;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: insets.bottom || 12,
      }}
    >
      {items.map((item) => {
        if ('isFab' in item && item.isFab) {
          return (
            <View key={item.key} style={{ flex: 1, alignItems: 'center' }}>
              <Pressable
                onPress={() => onPress('add')}
                style={{
                  marginTop: -22,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  ...shadows.ctaPrimary,
                }}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  locations={[0, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flex: 1,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus color="#FFFFFF" size={24} strokeWidth={1.8} />
                </LinearGradient>
              </Pressable>
            </View>
          );
        }

        const Icon = 'icon' in item ? item.icon! : Wallet;
        const isActive = active === item.key;
        const color = isActive ? theme.colors.primary : theme.colors.textSecondary;

        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item.key as any)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Icon color={color} size={22} strokeWidth={1.8} />
            <Text
              style={{
                color,
                fontFamily: typography.fontFamily.medium,
                fontSize: 10,
              }}
            >
              {'label' in item ? item.label : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
