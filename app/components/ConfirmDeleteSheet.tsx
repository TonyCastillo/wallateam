import { Modal, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon } from './Icon';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteSheet({
  visible,
  title,
  message,
  confirmLabel = 'Eliminar',
  onConfirm,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}
      />
      <View
        style={{
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 28,
          paddingHorizontal: 24,
          paddingBottom: Math.max(insets.bottom, 24) + 8,
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Pill handle */}
        <View
          style={{
            position: 'absolute',
            top: 10,
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.border,
          }}
        />

        {/* Icon circle */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.colors.danger + '18',
            borderWidth: 1.5,
            borderColor: theme.colors.danger + '40',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Icon name="Trash2" size={28} color={theme.colors.danger} />
        </View>

        {/* Title */}
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            color: theme.colors.textPrimary,
            textAlign: 'center',
            letterSpacing: -0.3,
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        {/* Message */}
        {message ? (
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 14,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 28,
            }}
          >
            {message}
          </Text>
        ) : (
          <View style={{ marginBottom: 28 }} />
        )}

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
          <Pressable
            onPress={onClose}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: theme.colors.border,
              alignItems: 'center',
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.semibold,
                fontSize: 15,
                color: theme.colors.textPrimary,
              }}
            >
              Cancelar
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onClose();
              onConfirm();
            }}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              backgroundColor: theme.colors.danger,
            }}
          >
            <Icon name="Trash2" size={16} color="#fff" />
            <Text
              style={{
                fontFamily: typography.fontFamily.semibold,
                fontSize: 15,
                color: '#fff',
              }}
            >
              {confirmLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
