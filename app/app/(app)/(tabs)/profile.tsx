import { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { typography } from '@/theme/tokens';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';

export default function Profile() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Usuario';

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmitCode = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      Alert.alert('Código inválido', 'Pegá el código completo (8 caracteres).');
      return;
    }
    setShowCodeInput(false);
    setCode('');
    router.push(`/invite/${trimmed}`);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setCode(text.trim().toUpperCase());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 20 }}>
        {/* Header del user */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar name={fullName} size={56} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 18,
                color: theme.colors.textPrimary,
              }}
            >
              {fullName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 12,
                color: theme.colors.textSecondary,
              }}
            >
              {user?.email ?? ''}
            </Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={{ gap: 10, marginTop: 8 }}>
          <Pressable
            onPress={() => setShowCodeInput(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderRadius: 14,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: theme.colors.primary + '1A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="Ticket" size={20} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: 14,
                  color: theme.colors.textPrimary,
                }}
              >
                Tengo un código
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 11,
                  color: theme.colors.textSecondary,
                }}
              >
                Pegá el código que te compartieron para unirte a una wallet
              </Text>
            </View>
            <Icon name="ChevronRight" size={18} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable
            onPress={signOut}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderRadius: 14,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: theme.colors.danger + '1A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="LogOut" size={20} color={theme.colors.danger} />
            </View>
            <Text
              style={{
                flex: 1,
                fontFamily: typography.fontFamily.semibold,
                fontSize: 14,
                color: theme.colors.danger,
              }}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>

        <Text
          style={{
            marginTop: 12,
            fontFamily: typography.fontFamily.regular,
            fontSize: 11,
            color: theme.colors.textSecondary,
            textAlign: 'center',
          }}
        >
          WallaTeam — fase 4 (Equipo)
        </Text>
      </View>

      {/* Modal: ingresar código */}
      <Modal
        visible={showCodeInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCodeInput(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowCodeInput(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            padding: 20,
            paddingBottom: 32,
            gap: 14,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.colors.border,
              marginBottom: 4,
            }}
          />

          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: 18,
              color: theme.colors.textPrimary,
            }}
          >
            Tengo un código
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 13,
              color: theme.colors.textSecondary,
              marginTop: -8,
            }}
          >
            Pegá el código que te compartieron
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              borderRadius: 12,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <TextInput
              autoFocus
              autoCapitalize="characters"
              autoCorrect={false}
              value={code}
              onChangeText={(t) => setCode(t.toUpperCase())}
              placeholder="ABCD1234"
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={12}
              style={{
                flex: 1,
                fontFamily: typography.fontFamily.bold,
                fontSize: 22,
                color: theme.colors.textPrimary,
                letterSpacing: 4,
                padding: 0,
              }}
              returnKeyType="done"
              onSubmitEditing={handleSubmitCode}
            />
            <Pressable
              onPress={handlePaste}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: theme.colors.primary + '1A',
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: 12,
                  color: theme.colors.primary,
                }}
              >
                Pegar
              </Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              label="Cancelar"
              variant="outline"
              onPress={() => {
                setShowCodeInput(false);
                setCode('');
              }}
              style={{ flex: 1 }}
            />
            <Button
              label="Continuar"
              variant="primary"
              onPress={handleSubmitCode}
              style={{ flex: 2 }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
