import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { useInvites, InvitePreview } from '@/stores/invites';
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';
import { WALLET_ICONS } from '@/lib/walletIcons';
import { Icon, IconName } from '@/components/Icon';
import { Button } from '@/components/Button';

function resolveLucide(walletIcon: string): IconName {
  const def = WALLET_ICONS.find((i) => i.id === walletIcon);
  return (def?.lucide ?? 'Wallet') as IconName;
}

export default function InviteScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setErrorMsg('Código inválido');
      setLoading(false);
      return;
    }
    let cancelled = false;
    useInvites
      .getState()
      .preview(code)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setErrorMsg('Invitación no encontrada');
        } else if (p.expired) {
          setErrorMsg('Invitación vencida');
        } else if (p.accepted) {
          // Si ya fue aceptada por alguien, igual permitimos intentar — el RPC es idempotente
          setPreview(p);
        } else {
          setPreview(p);
        }
      })
      .catch((err) => {
        if (!cancelled) setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const handleAccept = async () => {
    if (!code || !preview) return;
    setAccepting(true);
    try {
      const walletId = await useInvites.getState().accept(code);
      // refrescar wallets y expenses para que el nuevo wallet aparezca con sus gastos
      await useWallets.getState().fetchAll();
      await useExpenses.getState().fetchAll();
      router.replace(`/wallet/${walletId}`);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo aceptar la invitación');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      {/* AppBar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Icon name="X" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text
          style={{
            marginLeft: 12,
            fontFamily: typography.fontFamily.semibold,
            fontSize: 17,
            color: theme.colors.textPrimary,
          }}
        >
          Invitación
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', gap: 24 }}>
        {loading ? (
          <View style={{ alignItems: 'center', gap: 12 }}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 13,
                color: theme.colors.textSecondary,
              }}
            >
              Buscando invitación…
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={{ alignItems: 'center', gap: 14 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: theme.colors.danger + '22',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="AlertTriangle" size={28} color={theme.colors.danger} />
            </View>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 18,
                color: theme.colors.textPrimary,
                textAlign: 'center',
              }}
            >
              {errorMsg}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 13,
                color: theme.colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Pedile a quien te invitó que te genere un nuevo link.
            </Text>
            <Button label="Volver" variant="outline" onPress={() => router.back()} style={{ marginTop: 8 }} />
          </View>
        ) : preview ? (
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: theme.colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Fuiste invitado a unirte a esta wallet
            </Text>
            <LinearGradient
              colors={[preview.wallet_color, theme.colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 28,
                alignItems: 'center',
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={resolveLucide(preview.wallet_icon)} size={32} color="#fff" />
              </View>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: typography.fontFamily.bold,
                  fontSize: 22,
                  textAlign: 'center',
                }}
              >
                {preview.wallet_name}
              </Text>
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: typography.fontFamily.semibold,
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Equipo
                </Text>
              </View>
            </LinearGradient>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={() => router.back()}
                style={{ flex: 1 }}
              />
              <Button
                label={accepting ? 'Uniéndome…' : 'Unirme al equipo'}
                variant="primary"
                onPress={handleAccept}
                loading={accepting}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
