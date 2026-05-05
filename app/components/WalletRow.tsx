import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography, shadows } from '@/theme/tokens';
import { Wallet } from '@/lib/types';
import { WALLET_ICONS, DEFAULT_WALLET_ICON } from '@/lib/walletIcons';
import { fmtGs } from '@/lib/format';
import { useWalletBalance } from '@/lib/walletMetrics';
import { IconBox } from './IconBox';
import { Chip } from './Chip';

interface WalletRowProps {
  wallet: Wallet;
  onPress: () => void;
}

export function WalletRow({ wallet, onPress }: WalletRowProps) {
  const { theme } = useTheme();

  const iconDef =
    WALLET_ICONS.find((i) => i.id === wallet.icon) ||
    WALLET_ICONS.find((i) => i.id === DEFAULT_WALLET_ICON)!;

  const currentBalance = useWalletBalance(wallet.id);

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        ...shadows.card,
        marginBottom: 8,
      }}
    >
      <IconBox iconName={iconDef.lucide} color={wallet.color} size={44} />

      <View style={{ flex: 1, gap: 4 }}>
        {/* Fila 1: nombre + chip de tipo */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            style={{
              flexShrink: 1,
              fontFamily: typography.fontFamily.semibold,
              fontSize: 15,
              color: theme.colors.textPrimary,
            }}
            numberOfLines={1}
          >
            {wallet.name}
          </Text>
          <Chip
            label={wallet.type === 'personal' ? 'PERSONAL' : 'EQUIPO'}
            tone={wallet.type === 'personal' ? 'primary' : 'secondary'}
          />
        </View>

        {/* Fila 2: balance actual completo + sublabel */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <Text
            style={{
              flexShrink: 1,
              fontFamily: typography.fontFamily.semibold,
              fontSize: 17,
              color: theme.colors.textPrimary,
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {fmtGs(currentBalance)}
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 11,
              color: theme.colors.textSecondary,
            }}
          >
            Disponible
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
