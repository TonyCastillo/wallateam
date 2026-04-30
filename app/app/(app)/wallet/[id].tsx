import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';
import { fmtGsCompact } from '@/lib/format';
import { WALLET_ICONS } from '@/lib/walletIcons';
import { Icon, IconName } from '@/components/Icon';
import { Tabs } from '@/components/Tabs';
import { ProgressBar } from '@/components/ProgressBar';
import { Metric } from '@/components/Metric';
import { EmptyExpenses } from '@/components/EmptyExpenses';
import { withAlpha } from '@/components/IconBox';

type DetailTab = 'gastos' | 'resumen' | 'miembros';

function resolveLucideIcon(walletIcon: string): IconName {
  const def = WALLET_ICONS.find((i) => i.id === walletIcon);
  return (def?.lucide ?? 'Wallet') as IconName;
}

export default function WalletDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const wallet = useWallets((s) => (id ? s.byId(id) : undefined));
  const fetchById = useWallets((s) => s.fetchById);
  // Smoke test Fase 3.01 — se reemplaza por UI real en módulo 3.02
  const expensesCount = useExpenses((s) => (id ? s.list(id).length : 0));
  const expensesSpent = useExpenses((s) => (id ? s.totals(id).spent : 0));
  useEffect(() => {
    if (id) {
      // eslint-disable-next-line no-console
      console.log('[expenses smoke]', id, 'count:', expensesCount, 'spent:', expensesSpent);
    }
  }, [id, expensesCount, expensesSpent]);
  const [tab, setTab] = useState<DetailTab>('gastos');
  const [resolving, setResolving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (wallet) return;
    setResolving(true);
    fetchById(id).then((w) => {
      setResolving(false);
      if (!w) {
        setNotFound(true);
        Alert.alert('Wallet no encontrada', 'No tenés acceso o no existe.', [
          { text: 'Volver', onPress: () => router.back() },
        ]);
      }
    });
  }, [id, wallet, fetchById, router]);

  if (notFound) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  if (!wallet) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
        {resolving && (
          <Text
            style={{
              marginTop: 12,
              color: theme.colors.textSecondary,
              fontFamily: typography.fontFamily.regular,
            }}
          >
            Cargando wallet…
          </Text>
        )}
      </View>
    );
  }

  // Fase 2: gastado siempre 0; Fase 3 lo recalcula desde expenses
  const presupuesto = wallet.initial_balance;
  const gastado = 0;
  const restante = presupuesto - gastado;
  const usedPct = presupuesto > 0 ? gastado / presupuesto : 0;

  const lucide = resolveLucideIcon(wallet.icon);
  const isPersonal = wallet.type === 'personal';

  // Días restantes hasta target_date
  let daysLabel = 'sin fecha objetivo';
  if (wallet.target_date) {
    const target = new Date(wallet.target_date);
    const today = new Date();
    const diffMs = target.getTime() - today.getTime();
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    daysLabel = `${days} día${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`;
  }

  const tabItems: { key: DetailTab; label: string; disabled?: boolean }[] = [
    { key: 'gastos', label: 'Gastos' },
    { key: 'resumen', label: 'Resumen' },
    { key: 'miembros', label: 'Miembros', disabled: !wallet.type || wallet.type === 'personal' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header gradient */}
      <LinearGradient
        colors={[wallet.color, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: insets.top + 12 },
        ]}
      >
        {/* Top row */}
        <View style={styles.headerTopRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="ChevronLeft" size={26} color="#fff" strokeWidth={2} />
          </Pressable>
          <Pressable
            onPress={() => Alert.alert('Editar wallet', 'Próximamente')}
            hitSlop={10}
          >
            <Icon name="Settings" size={22} color="#fff" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Title row */}
        <View style={styles.titleRow}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={lucide} size={28} color="#fff" strokeWidth={2} />
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontFamily: typography.fontFamily.bold,
              }}
              numberOfLines={1}
            >
              {wallet.name}
            </Text>
            <View
              style={{
                alignSelf: 'flex-start',
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10,
                  fontFamily: typography.fontFamily.semibold,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isPersonal ? 'Personal' : 'Equipo'}
              </Text>
            </View>
          </View>
        </View>

        {/* Métricas */}
        <View style={styles.metricsRow}>
          <Metric
            label="Presupuesto"
            value={fmtGsCompact(presupuesto)}
            labelColor="rgba(255,255,255,0.7)"
            valueColor="#fff"
          />
          <Metric
            label="Gastado"
            value={fmtGsCompact(gastado)}
            labelColor="rgba(255,255,255,0.7)"
            valueColor="#fff"
            align="center"
          />
          <Metric
            label="Restante"
            value={fmtGsCompact(restante)}
            labelColor="rgba(255,255,255,0.7)"
            valueColor={theme.colors.accent}
            align="flex-end"
            highlight
          />
        </View>

        {/* Progress */}
        <View style={{ marginTop: 14 }}>
          <ProgressBar
            value={usedPct}
            tint="#fff"
            bg="rgba(255,255,255,0.2)"
          />
          <Text
            style={{
              marginTop: 8,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              fontFamily: typography.fontFamily.regular,
            }}
          >
            {Math.round(usedPct * 100)}% usado · {daysLabel}
          </Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <Tabs items={tabItems} active={tab} onChange={setTab} />

      {/* Contenido por tab */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {tab === 'gastos' && <EmptyExpenses />}
        {tab === 'resumen' && (
          <View style={{ padding: 24, alignItems: 'center', gap: 12 }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontSize: 16,
                fontFamily: typography.fontFamily.semibold,
              }}
            >
              Próximamente — Fase 8
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 13,
                fontFamily: typography.fontFamily.regular,
                textAlign: 'center',
              }}
            >
              Vas a poder ver gráficos y resumen mensual de tus gastos.
            </Text>
          </View>
        )}
        {tab === 'miembros' && (
          <View style={{ padding: 24, alignItems: 'center', gap: 12 }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontSize: 16,
                fontFamily: typography.fontFamily.semibold,
              }}
            >
              Próximamente — Fase 4
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 13,
                fontFamily: typography.fontFamily.regular,
                textAlign: 'center',
              }}
            >
              Wallets de equipo con invitaciones y miembros.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB Agregar gasto */}
      <Pressable
        onPress={() => Alert.alert('Agregar gasto', 'Próximamente — Fase 3')}
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 20,
            backgroundColor: withAlpha(wallet.color, 1),
          },
          theme.shadows.ctaPrimary,
        ]}
      >
        <Icon name="Plus" size={26} color="#fff" strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
