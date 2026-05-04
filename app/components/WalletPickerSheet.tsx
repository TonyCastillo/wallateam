import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { useWallets } from '@/stores/wallets';
import { WalletRow } from './WalletRow';

interface Props {
  visible: boolean;
  selected: string | null;
  onSelect: (walletId: string) => void;
  onClose: () => void;
}

export function WalletPickerSheet({ visible, selected, onSelect, onClose }: Props) {
  const { theme } = useTheme();
  
  // Wallets activas (personales y de equipo)
  const allWallets = useWallets((s) => s.wallets);
  const wallets = allWallets.filter((w) => !w.archived_at);

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
          maxHeight: '70%',
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
          Elegir wallet
        </Text>
        <ScrollView contentContainerStyle={{ gap: 8 }}>
          {wallets.length === 0 ? (
            <Text style={{ fontFamily: typography.fontFamily.regular, color: theme.colors.textSecondary, textAlign: 'center', padding: 20 }}>
              No tenés wallets disponibles
            </Text>
          ) : (
            wallets.map((wallet) => {
              const isSelected = selected === wallet.id;
              return (
                <View
                  key={wallet.id}
                  style={{
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? theme.colors.primary : 'transparent',
                    borderRadius: 18, // Para machear el radio de WalletRow si fuera necesario (usualmente 16)
                    overflow: 'hidden',
                  }}
                >
                  <WalletRow
                    wallet={wallet}
                    onPress={() => {
                      onSelect(wallet.id);
                      onClose();
                    }}
                  />
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
