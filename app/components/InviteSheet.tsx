import { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, Alert, Share, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
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

  const handleCopy = async () => {
    if (!url) return;
    await Clipboard.setStringAsync(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = async () => {
    if (!url) return;
    try {
      await Share.share({
        message: `Te invito a unirte a la wallet "${walletName}" en WallaTeam: ${url}`,
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
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: 20,
          paddingBottom: 32,
          gap: 14,
        }}
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
          Compartí este link para invitar
        </Text>

        {loading || !invite ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <>
            <View
              style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: 13,
                  color: theme.colors.textPrimary,
                }}
                selectable
                numberOfLines={1}
              >
                {url}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 11,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Vence en 7 días
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={handleCopy}
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
                  {copied ? 'Copiado' : 'Copiar link'}
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
      </View>
    </Modal>
  );
}
