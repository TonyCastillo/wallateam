import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { CATEGORIES, CategoryId } from '@/lib/categories';
import { IconBox } from './IconBox';

interface Props {
  visible: boolean;
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  onClose: () => void;
}

export function CategoryPicker({ visible, selected, onSelect, onClose }: Props) {
  const { theme } = useTheme();
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
          Elegir categoría
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {CATEGORIES.map((cat) => {
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
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
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
