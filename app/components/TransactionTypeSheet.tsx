import { Modal, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { ExpenseKind } from '@/lib/types';
import { Icon, IconName } from './Icon';

interface Props {
  visible: boolean;
  onSelect: (kind: ExpenseKind) => void;
  onClose: () => void;
}

interface Option {
  kind: ExpenseKind;
  label: string;
  description: string;
  icon: IconName;
  colorKey: 'primary' | 'accent';
}

const OPTIONS: Option[] = [
  {
    kind: 'expense',
    label: 'Nuevo gasto',
    description: 'Resta del saldo de la wallet.',
    icon: 'Receipt',
    colorKey: 'primary',
  },
  {
    kind: 'income',
    label: 'Cargar saldo',
    description: 'Suma un ingreso (ej: sueldo).',
    icon: 'PlusCircle',
    colorKey: 'accent',
  },
];

export function TransactionTypeSheet({ visible, onSelect, onClose }: Props) {
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
          paddingTop: 24,
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 12,
          gap: 12,
        }}
      >
        {/* Pill handle */}
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.border,
            marginBottom: 8,
          }}
        />

        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            color: theme.colors.textPrimary,
            textAlign: 'center',
            letterSpacing: -0.3,
            marginBottom: 4,
          }}
        >
          ¿Qué querés registrar?
        </Text>

        {OPTIONS.map((opt) => {
          const tint = opt.colorKey === 'accent' ? theme.colors.accent : theme.colors.primary;
          return (
            <Pressable
              key={opt.kind}
              onPress={() => {
                onClose();
                onSelect(opt.kind);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                borderRadius: 16,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: tint + '1A',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={opt.icon} size={22} color={tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semibold,
                    fontSize: 15,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {opt.label}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {opt.description}
                </Text>
              </View>
              <Icon name="ChevronRight" size={18} color={theme.colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}
