import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Avatar } from './Avatar';
import { WalletMember } from '@/lib/types';

interface AvatarStackProps {
  members: WalletMember[];
  max?: number;
  size?: number;
}

export function AvatarStack({ members, max = 4, size = 28 }: AvatarStackProps) {
  const { theme } = useTheme();
  const visible = members.slice(0, max);
  const overflow = Math.max(0, members.length - max);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {visible.map((m, idx) => (
        <View
          key={m.user_id}
          style={{
            marginLeft: idx === 0 ? 0 : -size * 0.32,
            zIndex: visible.length - idx,
          }}
        >
          <Avatar
            name={m.profile?.full_name ?? '?'}
            size={size}
            ring
            bg={'rgba(255,255,255,0.35)'}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={{
            marginLeft: -size * 0.32,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'rgba(255,255,255,0.35)',
            borderWidth: 2,
            borderColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: typography.fontFamily.semibold,
              fontSize: size * 0.36,
            }}
          >
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
}
