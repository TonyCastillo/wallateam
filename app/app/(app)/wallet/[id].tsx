import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';
import { useAuth } from '@/stores/auth';
import { useWalletMetrics } from '@/lib/walletMetrics';
import { fmtGs, fmtGsSigned } from '@/lib/format';
import { Expense, WalletMember, Wallet } from '@/lib/types';
import { WALLET_ICONS } from '@/lib/walletIcons';
import { Icon, IconName } from '@/components/Icon';
import { Tabs } from '@/components/Tabs';
import { ProgressBar } from '@/components/ProgressBar';
import { Metric } from '@/components/Metric';
import { BalanceLine } from '@/components/BalanceLine';
import { TransferLine } from '@/components/TransferLine';
import { useBalance } from '@/lib/balance';
import { EmptyExpenses } from '@/components/EmptyExpenses';
import { ExpenseRow } from '@/components/ExpenseRow';
import { ConfirmDeleteSheet } from '@/components/ConfirmDeleteSheet';
import { Avatar } from '@/components/Avatar';
import { AvatarStack } from '@/components/AvatarStack';
import { InviteSheet } from '@/components/InviteSheet';
import { TransactionTypeSheet } from '@/components/TransactionTypeSheet';
import { withAlpha } from '@/components/IconBox';

type DetailTab = 'gastos' | 'resumen' | 'miembros';

// Referencia estable para evitar bucles de render en selectores Zustand
const EMPTY_MEMBERS: WalletMember[] = [];

function resolveLucideIcon(walletIcon: string): IconName {
  const def = WALLET_ICONS.find((i) => i.id === walletIcon);
  return (def?.lucide ?? 'Wallet') as IconName;
}

// ----------------------------------------------------------------------------
// ExpensesList: tab Gastos del Detalle. Maneja loading, empty y refresh.
// ----------------------------------------------------------------------------
function ExpensesList({ walletId }: { walletId: string }) {
  const { theme } = useTheme();
  const router = useRouter();
  const list = useExpenses((s) => s.list(walletId));
  const loading = useExpenses((s) => s.loading);
  const fetchByWallet = useExpenses((s) => s.fetchByWallet);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchByWallet(walletId);
    setRefreshing(false);
  };

  const handleLongPress = useCallback((expense: Expense) => {
    Alert.alert(
      expense.description,
      fmtGs(expense.amount),
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Editar', onPress: () => router.push(`/expense/new?expenseId=${expense.id}`) },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setPendingDelete(expense),
        },
      ],
    );
  }, [router]);

  return (
    <View style={{ flex: 1 }}>
      {loading && list.length === 0 ? (
        <View style={{ padding: 16, gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                height: 68,
                borderRadius: 14,
                backgroundColor: theme.colors.surfaceAlt,
                opacity: 0.5,
              }}
            />
          ))}
        </View>
      ) : list.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
        >
          <EmptyExpenses walletId={walletId} />
        </ScrollView>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ExpenseRow
              expense={item}
              onPress={() => router.push(`/expense/new?expenseId=${item.id}`)}
              onLongPress={() => handleLongPress(item)}
            />
          )}
        />
      )}

      <ConfirmDeleteSheet
        visible={!!pendingDelete}
        title="Eliminar gasto"
        message={`¿Seguro que querés eliminar "${pendingDelete?.description}"? Esta acción no se puede deshacer.`}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await useExpenses.getState().remove(pendingDelete.id);
          } catch {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </View>
  );
}

// ----------------------------------------------------------------------------
// MembersTab: lista de miembros + botón Invitar (solo wallets team)
// ----------------------------------------------------------------------------
function MembersTab({ walletId, walletName }: { walletId: string; walletName: string }) {
  const { theme } = useTheme();
  const userId = useAuth((s) => s.user?.id);
  const members = useWallets((s) => s.membersByWallet[walletId]) ?? EMPTY_MEMBERS;
  const fetchMembers = useWallets((s) => s.fetchMembers);
  const [refreshing, setRefreshing] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMembers(walletId);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={members}
        keyExtractor={(m) => m.user_id}
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />
        }
        ListHeaderComponent={
          <Pressable
            onPress={() => setShowInvite(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.colors.primary,
              borderStyle: 'dashed',
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: withAlpha(theme.colors.primary, 0.12),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="UserPlus" size={20} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: 14,
                  color: theme.colors.primary,
                }}
              >
                Invitar
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 11,
                  color: theme.colors.textSecondary,
                }}
              >
                Compartí este link para invitar
              </Text>
            </View>
            <Icon name="ChevronRight" size={18} color={theme.colors.textSecondary} />
          </Pressable>
        }
        renderItem={({ item }: { item: WalletMember }) => {
          const isYou = item.user_id === userId;
          const name = item.profile?.full_name ?? '?';
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 14,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
            >
              <Avatar name={name} size={40} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semibold,
                    fontSize: 14,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {isYou ? `${name} (Vos)` : name}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 11,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {item.role === 'admin' ? 'Owner' : 'Miembro'}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 13,
                color: theme.colors.textSecondary,
              }}
            >
              Cargando miembros…
            </Text>
          </View>
        }
      />

      <InviteSheet
        visible={showInvite}
        walletId={walletId}
        walletName={walletName}
        onClose={() => setShowInvite(false)}
      />
    </View>
  );
}

// ----------------------------------------------------------------------------
// ResumenTab: tab Resumen del Detalle. Usa useBalance.
// ----------------------------------------------------------------------------
function ResumenTab({ wallet, members }: { wallet: Wallet; members: WalletMember[] }) {
  const { theme } = useTheme();
  const currentUserId = useAuth((s) => s.user?.id);
  const { nets, transfers, myNet, isSettled, loading } = useBalance(wallet.id);

  if (wallet.type === 'personal') {
    return (
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', gap: 12 }}>
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
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 24 }}>
      {/* Saldo del usuario actual */}
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 11, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
          TU SALDO
        </Text>
        <Text style={{ color: myNet > 0 ? theme.colors.accent : myNet < 0 ? theme.colors.danger : theme.colors.textPrimary, fontSize: 32, fontFamily: typography.fontFamily.bold }}>
          {fmtGsSigned(myNet)}
        </Text>
      </View>

      {/* Balance del grupo */}
      <View>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 11, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          BALANCE DEL GRUPO
        </Text>
        {loading && nets.length === 0 ? (
          <ActivityIndicator color={theme.colors.primary} style={{ alignSelf: 'flex-start' }} />
        ) : (
          nets.map((net) => {
            const member = members.find(m => m.user_id === net.user_id);
            const name = net.user_id === currentUserId ? 'Vos' : (member?.profile?.full_name ?? '?');
            return <BalanceLine key={net.user_id} name={name} net={net.net} />;
          })
        )}
      </View>

      {/* Transferencias necesarias */}
      <View>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 11, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          TRANSFERENCIAS NECESARIAS
        </Text>
        {loading && transfers.length === 0 ? (
          <ActivityIndicator color={theme.colors.primary} style={{ alignSelf: 'flex-start' }} />
        ) : isSettled ? (
          <View style={{ padding: 16, borderRadius: 14, backgroundColor: theme.colors.surface, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontFamily: typography.fontFamily.medium }}>
              ¡Todo saldado! Nadie debe nada.
            </Text>
          </View>
        ) : (
          transfers.map((t, idx) => {
            const fromMember = members.find(m => m.user_id === t.from);
            const toMember = members.find(m => m.user_id === t.to);
            const fromName = t.from === currentUserId ? 'Vos' : (fromMember?.profile?.full_name ?? '?');
            const toName = t.to === currentUserId ? 'Vos' : (toMember?.profile?.full_name ?? '?');
            const isCurrentUserInvolved = t.from === currentUserId || t.to === currentUserId;
            
            return (
              <TransferLine
                key={idx}
                fromName={fromName}
                toName={toName}
                amount={t.amount}
                isCurrentUserInvolved={isCurrentUserInvolved}
                onSettle={() => Alert.alert('Saldar deuda', 'Próximamente...')}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

// ----------------------------------------------------------------------------
// WalletDetailScreen
// ----------------------------------------------------------------------------
export default function WalletDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const wallet = useWallets((s) => (id ? s.byId(id) : undefined));
  const fetchById = useWallets((s) => s.fetchById);
  const fetchMembers = useWallets((s) => s.fetchMembers);
  const members = useWallets((s) => (wallet?.id ? s.membersByWallet[wallet.id] : undefined)) ?? EMPTY_MEMBERS;
  const [tab, setTab] = useState<DetailTab>('gastos');
  const [resolving, setResolving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showTxTypeSheet, setShowTxTypeSheet] = useState(false);

  // Debe estar antes de los early returns para respetar las Rules of Hooks
  const metrics = useWalletMetrics(wallet?.id);

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

  // Cargar miembros al entrar a una wallet team
  useEffect(() => {
    if (wallet?.type === 'team') {
      fetchMembers(wallet.id);
    }
  }, [wallet?.id, wallet?.type, fetchMembers]);

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

  const { presupuesto, gastado, ingresos, restante, saldoActual, usedPct, overBudget } = metrics;

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
    { key: 'miembros', label: 'Miembros', disabled: wallet.type === 'personal' },
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
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
              {!isPersonal && members.length > 0 && (
                <AvatarStack members={members} max={4} size={24} />
              )}
            </View>
          </View>
        </View>

        {/* Métricas — organizadas para mostrar el saldo principal arriba y el desglose abajo */}
        <View style={styles.metricsRow}>
          {isPersonal ? (
            <>
              <View style={{ marginBottom: 16 }}>
                <Metric
                  label="Saldo actual"
                  value={fmtGs(saldoActual)}
                  labelColor="rgba(255,255,255,0.7)"
                  valueColor={theme.colors.accent}
                  highlight
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <View style={{ flex: 1 }}>
                  <Metric
                    label="Ingresos"
                    value={fmtGs(ingresos)}
                    labelColor="rgba(255,255,255,0.7)"
                    valueColor="#fff"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Metric
                    label="Gastos"
                    value={fmtGs(gastado)}
                    labelColor="rgba(255,255,255,0.7)"
                    valueColor="#fff"
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={{ marginBottom: 16 }}>
                <Metric
                  label="Restante"
                  value={fmtGs(restante)}
                  labelColor="rgba(255,255,255,0.7)"
                  valueColor={theme.colors.accent}
                  highlight
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <View style={{ flex: 1 }}>
                  <Metric
                    label="Presupuesto"
                    value={fmtGs(presupuesto)}
                    labelColor="rgba(255,255,255,0.7)"
                    valueColor="#fff"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Metric
                    label="Gastado"
                    value={fmtGs(gastado)}
                    labelColor="rgba(255,255,255,0.7)"
                    valueColor="#fff"
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {/* Progress — solo en team (en personal "% usado" no aplica al haber ingresos) */}
        {!isPersonal && (
          <View style={{ marginTop: 14 }}>
            <ProgressBar
              value={usedPct}
              tint="#fff"
              bg="rgba(255,255,255,0.2)"
            />
            <Text
              style={{
                marginTop: 8,
                color: overBudget ? theme.colors.warning : 'rgba(255,255,255,0.7)',
                fontSize: 11,
                fontFamily: overBudget ? typography.fontFamily.semibold : typography.fontFamily.regular,
              }}
            >
              {Math.round(usedPct * 100)}% usado · {daysLabel}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Tabs */}
      <Tabs items={tabItems} active={tab} onChange={setTab} />

      {/* Contenido por tab — cada uno maneja su propio scroll */}
      <View style={{ flex: 1 }}>
        {tab === 'gastos' && <ExpensesList walletId={wallet.id} />}
        {tab === 'resumen' && <ResumenTab wallet={wallet} members={members} />}
        {tab === 'miembros' && <MembersTab walletId={wallet.id} walletName={wallet.name} />}
      </View>

      {/* FAB → en team va directo a "nuevo gasto"; en personal abre selector Gasto/Ingreso */}
      <Pressable
        onPress={() => {
          if (isPersonal) {
            setShowTxTypeSheet(true);
          } else {
            router.push(`/expense/new?walletId=${wallet.id}`);
          }
        }}
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

      <TransactionTypeSheet
        visible={showTxTypeSheet}
        onClose={() => setShowTxTypeSheet(false)}
        onSelect={(kind) => {
          router.push(`/expense/new?walletId=${wallet.id}&kind=${kind}`);
        }}
      />
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
