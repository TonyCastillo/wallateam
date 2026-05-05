import { View, Text, Modal, Pressable, FlatList } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { WalletMember } from '@/lib/types';

interface Props {
  visible: boolean;
  members: WalletMember[];
  selected: string;
  currentUserId?: string;
  onSelect: (userId: string) => void;
  onClose: () => void;
}

export function MemberPickerSheet({
  visible,
  members,
  selected,
  currentUserId,
  onSelect,
  onClose,
}: Props) {
  const { theme } = useTheme();

  const sorted = [...members].sort((a, b) => {
    if (a.user_id === currentUserId) return -1;
    if (b.user_id === currentUserId) return 1;
    return (a.profile?.full_name ?? '').localeCompare(b.profile?.full_name ?? '');
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onClose} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '70%',
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingTop: 12,
          paddingBottom: 24,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.border,
            marginBottom: 8,
          }}
        />
        <Text
          style={{
            paddingHorizontal: 20,
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            color: theme.colors.textPrimary,
            marginBottom: 8,
          }}
        >
          ¿Quién pagó?
        </Text>

        <FlatList
          data={sorted}
          keyExtractor={(m) => m.user_id}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => {
            const isYou = item.user_id === currentUserId;
            const name = item.profile?.full_name ?? '?';
            const isSelected = selected === item.user_id;
            return (
              <Pressable
                onPress={() => {
                  onSelect(item.user_id);
                  onClose();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: isSelected ? theme.colors.surface : 'transparent',
                }}
              >
                <Avatar name={name} size={36} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semibold,
                      fontSize: 14,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {isYou ? 'Vos' : name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.regular,
                      fontSize: 11,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {item.role === 'admin' ? 'Owner' : 'Miembro'}
                  </Text>
                </View>
                {isSelected && <Icon name="Check" size={18} color={theme.colors.primary} />}
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}
