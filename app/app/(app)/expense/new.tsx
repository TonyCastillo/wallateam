import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { useAuth } from '@/stores/auth';
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';
import { newExpenseSchema, NewExpenseForm } from '@/schemas/expense';
import { anyCategoryById, CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';
import { ExpenseKind } from '@/lib/types';

import { Icon } from '@/components/Icon';
import { AmountInput } from '@/components/AmountInput';
import { FormRow } from '@/components/FormRow';
import { CategoryPicker } from '@/components/CategoryPicker';
import { WalletPickerSheet } from '@/components/WalletPickerSheet';
import { ConfirmDeleteSheet } from '@/components/ConfirmDeleteSheet';
import { MemberPickerSheet } from '@/components/MemberPickerSheet';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';

const formatPYG = (n: number) => n.toLocaleString('es-PY');

export default function AddExpenseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ walletId?: string; expenseId?: string; kind?: ExpenseKind }>();
  const insets = useSafeAreaInsets();

  const isEdit = !!params.expenseId;

  const { user } = useAuth();
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Usuario';

  const allWallets = useWallets((s) => s.wallets);
  const wallets = allWallets.filter((w) => !w.archived_at);
  const fetchMembers = useWallets((s) => s.fetchMembers);
  const membersByWallet = useWallets((s) => s.membersByWallet);

  const existing = useExpenses((s) =>
    params.expenseId
      ? Object.values(s.byWallet).flat().find((e) => e.id === params.expenseId)
      : undefined
  );

  const initialWalletId = params.walletId ?? (wallets.length === 1 ? wallets[0].id : '');

  const [submitting, setSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showWalletPicker, setShowWalletPicker] = useState(!isEdit && !initialWalletId && wallets.length > 1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  const initialKind: ExpenseKind = existing?.kind ?? params.kind ?? 'expense';
  const defaultIncomeCat = INCOME_CATEGORIES[0].id;
  const defaultExpenseCat = CATEGORIES[0].id;

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<NewExpenseForm>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: existing
      ? {
          wallet_id: existing.wallet_id,
          description: existing.description,
          amount: Number(existing.amount),
          category: existing.category ?? (existing.kind === 'income' ? defaultIncomeCat : 'other'),
          kind: existing.kind,
          occurred_at: existing.occurred_at,
          note: existing.note,
          paid_by: existing.paid_by,
        }
      : {
          wallet_id: initialWalletId,
          description: '',
          amount: 0,
          category: initialKind === 'income' ? defaultIncomeCat : defaultExpenseCat,
          kind: initialKind,
          occurred_at: new Date().toISOString(),
          note: null,
          paid_by: user?.id,
        },
  });

  useEffect(() => {
    if (existing) {
      reset({
        wallet_id: existing.wallet_id,
        description: existing.description,
        amount: Number(existing.amount),
        category: existing.category ?? (existing.kind === 'income' ? defaultIncomeCat : 'other'),
        kind: existing.kind,
        occurred_at: existing.occurred_at,
        note: existing.note,
        paid_by: existing.paid_by,
      });
    }
  }, [existing?.id]);

  const watchedWalletId = watch('wallet_id');
  const watchedCategory = watch('category');
  const watchedKind = watch('kind');
  const watchedOccurredAt = watch('occurred_at');
  const watchedAmount = watch('amount');
  const watchedPaidBy = watch('paid_by');

  const selectedWallet = wallets.find((w) => w.id === watchedWalletId)
    ?? allWallets.find((w) => w.id === watchedWalletId);
  const isIncome = watchedKind === 'income';
  const selectedCategoryDef = anyCategoryById(watchedCategory, watchedKind);
  const expenseDate = new Date(watchedOccurredAt);
  const isTeamWallet = selectedWallet?.type === 'team';
  const isPersonalWallet = selectedWallet?.type === 'personal';
  // El toggle Gasto/Ingreso solo aplica a wallets personales y no en modo edit
  // (mantenemos el kind original al editar para no romper supuestos del usuario).
  const showKindToggle = isPersonalWallet && !isEdit;
  const walletMembers = isTeamWallet && selectedWallet ? membersByWallet[selectedWallet.id] ?? [] : [];
  const canPickPayer = isTeamWallet && walletMembers.length > 1;
  const selectedPayer = walletMembers.find((m) => m.user_id === watchedPaidBy);
  const payerName = selectedPayer
    ? selectedPayer.user_id === user?.id
      ? fullName
      : selectedPayer.profile?.full_name ?? '?'
    : fullName;

  // Cargar miembros cuando la wallet seleccionada es team
  useEffect(() => {
    if (isTeamWallet && selectedWallet) {
      fetchMembers(selectedWallet.id);
    }
  }, [isTeamWallet, selectedWallet?.id, fetchMembers]);

  // Si la wallet cambia y no es team, resetear paid_by al user actual
  useEffect(() => {
    if (!isTeamWallet && user?.id && watchedPaidBy !== user.id) {
      setValue('paid_by', user.id);
    }
  }, [isTeamWallet, user?.id, watchedPaidBy, setValue]);

  // En wallets team, el kind siempre es 'expense' (los ingresos son MVP solo personal).
  useEffect(() => {
    if (isTeamWallet && watchedKind !== 'expense') {
      setValue('kind', 'expense');
    }
  }, [isTeamWallet, watchedKind, setValue]);

  const formatDateForDisplay = (d: Date) => {
    const isToday = new Date().toDateString() === d.toDateString();
    const dateStr = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    return isToday ? `Hoy · ${dateStr}` : dateStr;
  };
  const formatTimeForDisplay = (d: Date) =>
    d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  async function onSubmit(values: NewExpenseForm) {
    if (!values.wallet_id) {
      Alert.alert('Falta wallet', 'Por favor seleccioná una wallet');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && params.expenseId) {
        await useExpenses.getState().update(params.expenseId, {
          description: values.description.trim(),
          amount: values.amount,
          category: values.category,
          occurred_at: values.occurred_at,
          note: values.note ?? null,
          paid_by: values.paid_by,
        });
      } else {
        await useExpenses.getState().create({
          wallet_id: values.wallet_id,
          description: values.description.trim(),
          amount: values.amount,
          category: values.category,
          kind: values.kind,
          occurred_at: values.occurred_at,
          note: values.note ?? null,
          paid_by: values.paid_by,
        });
      }
      router.back();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!params.expenseId) return;
    try {
      await useExpenses.getState().remove(params.expenseId);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo eliminar');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* AppBar */}
        <View style={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: theme.colors.surface,
              alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border,
            }}
          >
            <Icon name="ArrowLeft" size={20} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 16, color: theme.colors.textPrimary, letterSpacing: -0.2 }}>
              {isEdit
                ? (isIncome ? 'Editar ingreso' : 'Editar gasto')
                : (isIncome ? 'Cargar saldo' : 'Nuevo gasto')}
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary }}>
              {isEdit
                ? 'Modificá los datos'
                : (isIncome ? 'Sumá un ingreso a tu wallet' : 'Registrá un movimiento')}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100, paddingTop: 6 }}>
          {/* Toggle Gasto / Ingreso — solo en wallets personales y solo en modo create */}
          {showKindToggle && (
            <View style={{
              flexDirection: 'row',
              padding: 4,
              borderRadius: 14,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              marginBottom: 12,
            }}>
              {(['expense', 'income'] as const).map((k) => {
                const active = watchedKind === k;
                const label = k === 'expense' ? 'Gasto' : 'Ingreso';
                const activeColor = k === 'income' ? theme.colors.accent : theme.colors.primary;
                return (
                  <Pressable
                    key={k}
                    onPress={() => {
                      setValue('kind', k);
                      // Reset a la primera categoría del set correspondiente
                      setValue('category', k === 'income' ? defaultIncomeCat : defaultExpenseCat);
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: active ? activeColor : 'transparent',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontFamily: typography.fontFamily.semibold,
                      fontSize: 13,
                      color: active ? '#fff' : theme.colors.textSecondary,
                    }}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Card de Monto */}
          <View style={{
            padding: 18, borderRadius: 18, backgroundColor: theme.colors.surface,
            borderWidth: 1, borderColor: isIncome ? theme.colors.accent : theme.colors.border,
          }}>
            <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 11, color: isIncome ? theme.colors.accent : theme.colors.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              {isIncome ? 'Ingreso' : 'Monto'}
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <AmountInput
                  autoFocus={!isEdit}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.amount && (
              <Text style={{ color: theme.colors.danger, fontSize: 11, marginTop: 4 }}>{errors.amount.message}</Text>
            )}
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10,
              paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8,
              backgroundColor: theme.colors.primary + '1A', alignSelf: 'flex-start',
            }}>
              <Icon name="Tag" size={12} color={theme.colors.primary} />
              <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 11, color: theme.colors.primary }}>
                Guaraníes (PYG)
              </Text>
            </View>
          </View>

          {/* FormRows */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <FormRow
                iconName="Tag"
                label="Descripción"
                error={errors.description?.message}
                value={
                  <TextInput
                    style={{
                      flex: 1,
                      fontFamily: typography.fontFamily.semibold,
                      fontSize: 13,
                      color: theme.colors.textPrimary,
                      padding: 0,
                    }}
                    placeholder="Cena restaurant"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    maxLength={80}
                  />
                }
              />
            )}
          />

          <FormRow
            iconName={selectedCategoryDef.icon}
            label={isIncome ? 'Tipo de ingreso' : 'Categoría'}
            value={selectedCategoryDef.label}
            onPress={() => setShowCategoryPicker(true)}
            error={errors.category?.message}
          />

          {/* Wallet: no editable en modo edit */}
          <FormRow
            iconName="Wallet"
            label="Wallet"
            value={selectedWallet ? selectedWallet.name : 'Seleccionar wallet...'}
            chip={
              selectedWallet
                ? selectedWallet.type === 'personal'
                  ? { text: 'PERSONAL', tone: 'primary' }
                  : { text: 'EQUIPO', tone: 'secondary' }
                : undefined
            }
            onPress={isEdit ? undefined : (!params.walletId ? () => setShowWalletPicker(true) : undefined)}
            error={errors.wallet_id?.message}
          />

          <FormRow
            iconName="Calendar"
            label="Fecha"
            value={formatDateForDisplay(expenseDate)}
            subValue={formatTimeForDisplay(expenseDate)}
            onPress={() => {
              if (Platform.OS === 'ios') {
                setShowDatePicker(!showDatePicker);
              } else {
                setShowDatePicker(true);
              }
            }}
            error={errors.occurred_at?.message}
          />

          {/* "Pagado por" solo aplica en wallets team — en personal el pagador siempre es el dueño */}
          {isTeamWallet && (
            <FormRow
              iconName="User"
              label={isIncome ? 'Cargado por' : 'Pagado por'}
              value={payerName}
              trailing={<Avatar name={payerName} size={26} />}
              onPress={canPickPayer ? () => setShowMemberPicker(true) : undefined}
            />
          )}

          {/* Sección Cómo dividir (Fase 5) — solo aplica en wallets team de gasto */}
          {isTeamWallet && !isIncome && (
          <View style={{ marginTop: 14, padding: 16, borderRadius: 18, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 13, color: theme.colors.textPrimary }}>Cómo dividir</Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>Multi-split disponible en Fase 5</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4, padding: 3, backgroundColor: theme.colors.background, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, opacity: 0.4 }}>
                <View style={{ width: 36, paddingVertical: 6, alignItems: 'center', borderRadius: 7, backgroundColor: theme.colors.primary }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>=</Text>
                </View>
                <View style={{ width: 36, paddingVertical: 6, alignItems: 'center', borderRadius: 7 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary }}>%</Text>
                </View>
                <View style={{ width: 36, paddingVertical: 6, alignItems: 'center', borderRadius: 7 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary }}>₲</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, opacity: 0.4 }}>
              <Avatar name={fullName} size={32} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 13, color: theme.colors.textPrimary }}>Vos</Text>
                <View style={{ height: 5, marginTop: 5, borderRadius: 3, backgroundColor: theme.colors.background, overflow: 'hidden' }}>
                  <View style={{ width: '100%', height: '100%', backgroundColor: theme.colors.primary }} />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, minWidth: 70, justifyContent: 'flex-end' }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 16, color: theme.colors.textPrimary }}>100</Text>
                <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 11, color: theme.colors.textSecondary }}>%</Text>
              </View>
              <View style={{ minWidth: 64, alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary }}>
                  {watchedAmount > 0 ? formatPYG(watchedAmount) : '0'}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: theme.colors.background, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 12, color: theme.colors.textSecondary }}>Total asignado</Text>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 12, color: theme.colors.accent }}>
                100% · {watchedAmount > 0 ? formatPYG(watchedAmount) : '0'}
              </Text>
            </View>
          </View>
          )}

          {/* Adjuntar ticket */}
          <View style={{ marginTop: 12, flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => Alert.alert('Próximamente', 'Fase 8')}
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Icon name="Camera" size={16} color={theme.colors.textSecondary} />
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 12, color: theme.colors.textSecondary }}>Adjuntar ticket</Text>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert('Próximamente', 'Fase 8')}
              style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Plus" size={18} color={theme.colors.textSecondary} />
            </Pressable>
          </View>

          {/* Botón Eliminar — solo en modo edit */}
          {isEdit && (
            <Pressable
              onPress={() => setShowDeleteConfirm(true)}
              style={{
                marginTop: 24,
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.colors.danger,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Icon name="Trash2" size={18} color={theme.colors.danger} />
              <Text style={{ color: theme.colors.danger, fontFamily: typography.fontFamily.semibold, fontSize: 15 }}>
                Eliminar gasto
              </Text>
            </Pressable>
          )}
        </ScrollView>

        {/* CTA Bar */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: theme.colors.background,
          borderTopWidth: 1, borderColor: theme.colors.border,
          paddingTop: 10, paddingHorizontal: 18, paddingBottom: Math.max(insets.bottom, 14),
          flexDirection: 'row', gap: 10,
        }}>
          <Button
            label="Cancelar"
            variant="outline"
            onPress={() => router.back()}
            style={{ flex: 1 }}
          />
          <Button
            label={
              isEdit
                ? 'Guardar cambios'
                : (isIncome ? 'Cargar saldo' : 'Guardar gasto')
            }
            variant="primary"
            iconLeft="Check"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            style={{ flex: 2 }}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Pickers */}
      <CategoryPicker
        visible={showCategoryPicker}
        kind={watchedKind}
        selected={watchedCategory}
        onSelect={(cat) => setValue('category', cat)}
        onClose={() => setShowCategoryPicker(false)}
      />

      <WalletPickerSheet
        visible={showWalletPicker}
        selected={watchedWalletId}
        onSelect={(id) => setValue('wallet_id', id)}
        onClose={() => setShowWalletPicker(false)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={expenseDate}
          mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            if (Platform.OS === 'android') {
              setShowDatePicker(false);
            }
            if (date) {
              if (Platform.OS === 'ios') {
                setValue('occurred_at', date.toISOString());
              } else {
                const newDate = new Date(expenseDate);
                newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                setValue('occurred_at', newDate.toISOString());
                setTimeout(() => setShowTimePicker(true), 50);
              }
            }
          }}
        />
      )}

      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={expenseDate}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              const newDate = new Date(expenseDate);
              newDate.setHours(date.getHours(), date.getMinutes());
              setValue('occurred_at', newDate.toISOString());
            }
          }}
        />
      )}

      <ConfirmDeleteSheet
        visible={showDeleteConfirm}
        title="Eliminar gasto"
        message={`¿Seguro que querés eliminar "${existing?.description}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />

      <MemberPickerSheet
        visible={showMemberPicker}
        members={walletMembers}
        selected={watchedPaidBy ?? user?.id ?? ''}
        currentUserId={user?.id}
        onSelect={(uid) => setValue('paid_by', uid)}
        onClose={() => setShowMemberPicker(false)}
      />
    </SafeAreaView>
  );
}
