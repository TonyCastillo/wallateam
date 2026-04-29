import { View, Text, ScrollView, RefreshControl, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { useWallets, useTotalBalance } from '@/stores/wallets';
import { typography } from '@/theme/tokens';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { BalanceCard } from '@/components/BalanceCard';
import { QuickAction } from '@/components/QuickAction';
import { SectionHeader } from '@/components/SectionHeader';
import { WalletRow } from '@/components/WalletRow';
import { IconBox } from '@/components/IconBox';
import { Button } from '@/components/Button';

export default function Home() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const { user } = useAuth();
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? '';

  const wallets = useWallets((s) => s.wallets);
  const loading = useWallets((s) => s.loading);
  const fetchAll = useWallets((s) => s.fetchAll);
  
  const { total, personal, team } = useTotalBalance();

  const handleCreateWallet = () => router.push('/create-wallet');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAll} tintColor={theme.colors.primary} />
        }
      >
        {/* 1. Top bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, marginBottom: 16 }}>
          <Avatar name={fullName} size={40} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 12, color: theme.colors.textSecondary }}>
              Hola,
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 16, color: theme.colors.textPrimary }}>
              {fullName}
            </Text>
          </View>
          <Pressable onPress={() => Alert.alert('Próximamente', 'Notificaciones en Fase 8')} style={{ position: 'relative', padding: 4 }}>
            <Icon name="Bell" size={24} color={theme.colors.textPrimary} />
            <View style={{ position: 'absolute', top: 4, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.danger, borderWidth: 1.5, borderColor: theme.colors.background }} />
          </Pressable>
        </View>

        {/* 2. BalanceCard */}
        <BalanceCard total={total} personal={personal} team={team} />

        {/* 3. Quick actions row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 18 }}>
          <QuickAction iconName="Receipt" label="Gasto" variant="filled" onPress={() => Alert.alert('Próximamente', 'Fase 3')} />
          <QuickAction iconName="Wallet" label="Wallet" variant="subtle" onPress={handleCreateWallet} />
          <QuickAction iconName="UserPlus" label="Invitar" variant="subtle" onPress={() => Alert.alert('Próximamente', 'Fase 4')} />
          <QuickAction iconName="ArrowRightLeft" label="Saldar" variant="subtle" onPress={() => Alert.alert('Próximamente', 'Fase 6')} />
        </View>

        {/* 4. SectionHeader Mis wallets */}
        <SectionHeader title="Mis wallets" actionLabel="Ver todas" onAction={() => Alert.alert('Próximamente')} />

        {/* 5. Lista de wallets */}
        <View style={{ paddingHorizontal: 20 }}>
          {loading && wallets.length === 0 ? (
            <View style={{ gap: 8 }}>
              {[1, 2, 3].map((key) => (
                <View key={key} style={{ height: 72, backgroundColor: theme.colors.surfaceAlt, borderRadius: 16 }} />
              ))}
            </View>
          ) : wallets.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 24, gap: 12, backgroundColor: theme.colors.surface, borderRadius: 16 }}>
              <IconBox iconName="Wallet" color={theme.colors.primary} size={64} />
              <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 16, color: theme.colors.textPrimary }}>
                Todavía no tenés wallets
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, color: theme.colors.textSecondary, textAlign: 'center' }}>
                Creá una wallet para empezar a organizar tus gastos.
              </Text>
              <Button label="Crear mi primera wallet" iconRight="Plus" onPress={handleCreateWallet} style={{ width: '100%' }} />
            </View>
          ) : (
            <View>
              {wallets.map((wallet) => (
                <WalletRow key={wallet.id} wallet={wallet} onPress={() => router.push(`/wallet/${wallet.id}`)} />
              ))}
            </View>
          )}
        </View>

        {/* 6. SectionHeader Actividad reciente */}
        <SectionHeader title="Actividad reciente" actionLabel="Ver todo" onAction={() => Alert.alert('Próximamente')} />

        {/* 7. Lista de actividad placeholder */}
        <View style={{ paddingHorizontal: 20, gap: 8 }}>
          {[1, 2].map((key) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: theme.colors.surface, borderRadius: 16 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Clock" size={22} color={theme.colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: 14, color: theme.colors.textPrimary }}>
                  Próximamente — Fase 3
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 12, color: theme.colors.textSecondary }}>
                  Aquí verás los últimos gastos
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
