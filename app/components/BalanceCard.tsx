import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { typography, shadows } from '@/theme/tokens';
import { fmtGs, fmtGsCompact } from '@/lib/format';

interface BalanceCardProps {
  total: number;
  personal: number;
  team: number;
}

export function BalanceCard({ total, personal, team }: BalanceCardProps) {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.secondary, theme.colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        padding: 18,
        marginHorizontal: 20,
        ...shadows.cardHi,
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.semibold,
          fontSize: 11,
          color: 'rgba(255, 255, 255, 0.8)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        BALANCE TOTAL
      </Text>
      
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 28,
          color: '#FFFFFF',
          marginTop: 4,
        }}
      >
        {fmtGs(total)}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginVertical: 14,
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.85)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 2,
            }}
          >
            PERSONAL
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.semibold,
              fontSize: 16,
              color: '#FFFFFF',
            }}
          >
            {fmtGsCompact(personal)}
          </Text>
        </View>

        <View
          style={{
            width: 1,
            height: 30,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            marginHorizontal: 16,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.85)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 2,
            }}
          >
            EN EQUIPO
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.semibold,
              fontSize: 16,
              color: '#FFFFFF',
            }}
          >
            {fmtGsCompact(team)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
