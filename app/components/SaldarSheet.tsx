import { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon } from './Icon';
import { AmountInput } from './AmountInput';

interface Props {
  visible: boolean;
  walletId: string;
  fromUserId: string;
  toUserId: string;
  fromName: string;
  toName: string;
  suggestedAmount: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
}

export function SaldarSheet({
  visible,
  fromName,
  toName,
  suggestedAmount,
  onConfirm,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(suggestedAmount);

  // Reiniciar el valor cuando se abre
  useEffect(() => {
    if (visible) {
      setAmount(suggestedAmount);
    }
  }, [visible, suggestedAmount]);

  const handleConfirm = () => {
    if (amount <= 0) {
      Alert.alert('Monto inválido', 'El monto a saldar debe ser mayor a 0');
      return;
    }
    // Tolerancia para evitar bloqueos por un guaraní, pero advertimos si es más.
    if (amount > suggestedAmount + 10) {
      Alert.alert('Monto excedido', `Estás pagando más de lo que debes (₲ ${suggestedAmount.toLocaleString('es-PY')})`);
      return;
    }
    onClose();
    onConfirm(amount);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
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
              backgroundColor: theme.colors.accent + '18',
              borderWidth: 1.5,
              borderColor: theme.colors.accent + '40',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Icon name="CheckCircle2" size={28} color={theme.colors.accent} />
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
            Marcar como saldado
          </Text>

          {/* Message */}
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 14,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            {fromName} le pagó a {toName}
          </Text>

          {/* Input de monto */}
          <View style={{
            width: '100%',
            padding: 16,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 28,
          }}>
            <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: 11, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              Monto a registrar
            </Text>
            <AmountInput
              value={amount}
              onChange={setAmount}
              autoFocus
            />
          </View>

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
              onPress={handleConfirm}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                backgroundColor: theme.colors.accent,
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: 15,
                  color: '#fff',
                }}
              >
                Registrar
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
