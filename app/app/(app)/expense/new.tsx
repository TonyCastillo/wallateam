import { useState } from 'react';
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
import { categoryById } from '@/lib/categories';

import { Icon } from '@/components/Icon';
import { AmountInput } from '@/components/AmountInput';
import { FormRow } from '@/components/FormRow';
import { CategoryPicker } from '@/components/CategoryPicker';
import { WalletPickerSheet } from '@/components/WalletPickerSheet';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';

// Utility for formatting PYG
const formatPYG = (n: number) => n.toLocaleString('es-PY');

export default function AddExpenseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ walletId?: string }>();
  const insets = useSafeAreaInsets();
  
  const { user } = useAuth();
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Usuario';

  const allWallets = useWallets((s) => s.wallets);
  const wallets = allWallets.filter((w) => w.type === 'personal' && !w.archived_at);
  
  // Si no viene walletId, intentamos preseleccionar la única, si es que hay una. Si hay varias, quedará vacío para forzar selección.
  const initialWalletId = params.walletId ?? (wallets.length === 1 ? wallets[0].id : '');

  const [submitting, setSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Controlamos la apertura automática del picker de wallets si es necesario
  const [showWalletPicker, setShowWalletPicker] = useState(!initialWalletId && wallets.length > 1);

  // DatePicker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<NewExpenseForm>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: {
      wallet_id: initialWalletId,
      description: '',
      amount: 0,
      category: 'food',
      occurred_at: new Date().toISOString(),
      note: null,
    },
  });

  const watchedWalletId = watch('wallet_id');
  const watchedCategory = watch('category');
  const watchedOccurredAt = watch('occurred_at');
  const watchedAmount = watch('amount');

  const selectedWallet = wallets.find((w) => w.id === watchedWalletId);
  const selectedCategoryDef = categoryById(watchedCategory);
  const expenseDate = new Date(watchedOccurredAt);

  // Format Date (Hoy · 17 mar 2026, etc)
  const formatDateForDisplay = (d: Date) => {
    const isToday = new Date().toDateString() === d.toDateString();
    const dateStr = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    return isToday ? `Hoy · ${dateStr}` : dateStr;
  };
  const formatTimeForDisplay = (d: Date) => {
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  async function onSubmit(values: NewExpenseForm) {
    if (!values.wallet_id) {
      Alert.alert('Falta wallet', 'Por favor seleccioná una wallet');
      return;
    }
    setSubmitting(true);
    try {
      await useExpenses.getState().create({
        wallet_id: values.wallet_id,
        description: values.description.trim(),
        amount: values.amount,
        category: values.category,
        occurred_at: values.occurred_at,
        note: values.note ?? null,
      });
      router.back();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSubmitting(false);
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
              Nuevo gasto
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary }}>
              Registrá un movimiento
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100, paddingTop: 6 }}>
          {/* Card de Monto */}
          <View style={{
            padding: 18, borderRadius: 18, backgroundColor: theme.colors.surface,
            borderWidth: 1, borderColor: theme.colors.border,
          }}>
            <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 11, color: theme.colors.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              Monto
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <AmountInput
                  autoFocus
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
            label="Categoría"
            value={selectedCategoryDef.label}
            onPress={() => setShowCategoryPicker(true)}
            error={errors.category?.message}
          />

          <FormRow
            iconName="Wallet"
            label="Wallet"
            value={selectedWallet ? selectedWallet.name : 'Seleccionar wallet...'}
            chip={selectedWallet?.type === 'personal' ? { text: 'PERSONAL', tone: 'primary' } : undefined}
            onPress={!params.walletId ? () => setShowWalletPicker(true) : undefined} // No permite cambiar si vino en URL
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

          <FormRow
            iconName="User"
            label="Pagado por"
            value={fullName}
            trailing={<Avatar name={fullName} size={26} />}
          />

          {/* Sección Cómo dividir (Fase 5) */}
          <View style={{ marginTop: 14, padding: 16, borderRadius: 18, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 13, color: theme.colors.textPrimary }}>Cómo dividir</Text>
                <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>Multi-split disponible en Fase 5</Text>
              </View>
              {/* Fake Segmented Control */}
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

            {/* SplitRow Placeholder */}
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

            {/* Footer asignado */}
            <View style={{ marginTop: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: theme.colors.background, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 12, color: theme.colors.textSecondary }}>Total asignado</Text>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 12, color: theme.colors.accent }}>
                100% · {watchedAmount > 0 ? formatPYG(watchedAmount) : '0'}
              </Text>
            </View>
          </View>

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
            label="Guardar gasto"
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
              const newDate = new Date(expenseDate);
              if (Platform.OS === 'ios') {
                 // iOS sets both date and time in datetime mode
                 setValue('occurred_at', date.toISOString());
              } else {
                 // Android only sets date
                 newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                 setValue('occurred_at', newDate.toISOString());
                 // Auto open time picker after date on Android
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
    </SafeAreaView>
  );
}
