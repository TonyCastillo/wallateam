import { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, Alert, Share, ActivityIndicator, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon } from './Icon';
import { useInvites } from '@/stores/invites';
import { WalletInvite } from '@/lib/types';

interface InviteSheetProps {
  visible: boolean;
  walletId: string;
  walletName: string;
  onClose: () => void;
}

function buildInviteUrl(code: string) {
  return `wallateam://invite/${code}`;
}

export function InviteSheet({ visible, walletId, walletName, onClose }: InviteSheetProps) {
  const { theme } = useTheme();
  const [invite, setInvite] = useState<WalletInvite | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!visible) {
      setInvite(null);
      setCopied(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    useInvites
      .getState()
      .create(walletId, { expiresInDays: 7 })
      .then((inv) => {
        if (!cancelled) setInvite(inv);
      })
      .catch((err) => {
        if (!cancelled) {
          Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo crear la invitación');
          onClose();
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [visible, walletId]);

  const url = invite ? buildInviteUrl(invite.invite_code) : '';
  const code = invite?.invite_code ?? '';

  const handleCopyCode = async () => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async () => {
    if (!code) return;
    try {
      await Share.share({
        message:
          `Te invito a unirte a la wallet "${walletName}" en WallaTeam.\n\n` +
          `Tu código de invitación es: ${code}\n\n` +
          `Abrí WallaTeam → Perfil → "Tengo un código" y pegalo.`,
      });
    } catch {
      /* cancelado por el user */
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onClose} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '90%',
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
        }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 32, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pill handle */}
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
            Invitar a la wallet
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 13,
              color: theme.colors.textSecondary,
              marginTop: -8,
            }}
          >
            Compartí el código o el QR para sumar a otros
          </Text>

          {loading || !invite ? (
            <View style={{ paddingVertical: 48, alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <>
              {/* QR */}
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 18,
                  borderRadius: 14,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <QRCode value={url} size={180} backgroundColor="#fff" color="#000" />
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 11,
                    color: '#555',
                  }}
                >
                  Escaneá con la cámara desde otra cuenta
                </Text>
              </View>

              {/* Código grande */}
              <View
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semibold,
                    fontSize: 11,
                    color: theme.colors.textSecondary,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                  }}
                >
                  Código de invitación
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.bold,
                    fontSize: 28,
                    color: theme.colors.primary,
                    letterSpacing: 4,
                    marginTop: 4,
                  }}
                  selectable
                >
                  {code}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 11,
                    color: theme.colors.textSecondary,
                    marginTop: 6,
                    textAlign: 'center',
                  }}
                >
                  El otro user lo pega desde Perfil → "Tengo un código"
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 10,
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  Vence en 7 días
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={handleCopyCode}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Icon name={copied ? 'Check' : 'Copy'} size={16} color={theme.colors.textPrimary} />
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semibold,
                      fontSize: 14,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {copied ? 'Copiado' : 'Copiar código'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleShare}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Icon name="Share2" size={16} color="#fff" />
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semibold,
                      fontSize: 14,
                      color: '#fff',
                    }}
                  >
                    Compartir
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
