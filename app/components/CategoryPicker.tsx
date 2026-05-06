import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';
import { IconBox } from './IconBox';

interface Props {
  visible: boolean;
  /**
   * Set de categorías a mostrar. 'expense' (default) y 'settlement' usan CATEGORIES,
   * 'income' usa INCOME_CATEGORIES. (Settlements no requieren categoría visible al
   * usuario — el picker no se abre desde el flujo de saldar — pero el tipo lo soporta
   * para mantener consistencia con ExpenseKind.)
   */
  kind?: 'expense' | 'income' | 'settlement';
  selected: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function CategoryPicker({ visible, kind = 'expense', selected, onSelect, onClose }: Props) {
  const { theme } = useTheme();
  const list = kind === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  const title = kind === 'income' ? 'Elegir tipo de ingreso' : 'Elegir categoría';
  const accent = kind === 'income' ? theme.colors.accent : theme.colors.primary;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
      />
      <View
        style={{
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          paddingBottom: 32,
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            color: theme.colors.textPrimary,
            marginBottom: 16,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {list.map((cat) => {
            const isSelected = selected === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  onSelect(cat.id);
                  onClose();
                }}
                style={{
                  width: '22%',
                  alignItems: 'center',
                  gap: 8,
                  padding: 12,
                  borderRadius: 14,
                  borderWidth: isSelected ? 2.5 : 1,
                  borderColor: isSelected ? accent : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                }}
              >
                <IconBox iconName={cat.icon} color={cat.color} size={36} />
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 11,
                    color: theme.colors.textPrimary,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
