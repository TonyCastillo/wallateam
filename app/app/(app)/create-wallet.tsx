import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '@/theme/ThemeProvider';
import { typography, shadows } from '@/theme/tokens';
import { useWallets } from '@/stores/wallets';
import { newWalletSchema, NewWalletForm } from '@/schemas/wallet';
import { WALLET_ICONS } from '@/lib/walletIcons';
import { WalletIcon } from '@/lib/types';

import { Icon } from '@/components/Icon';
import { IconBox, withAlpha } from '@/components/IconBox';
import { ToggleRow } from '@/components/ToggleRow';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

const COLOR_PALETTE = [
  '#16A085', '#1F3A5F', '#3B82F6', '#2ECC71',
  '#E74C3C', '#F39C12', '#9B59B6', '#7F8C8D',
];

const QUICK_ADD_AMOUNTS = [100_000, 500_000, 1_000_000, 5_000_000];

export default function CreateWallet() {
  const { theme } = useTheme();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<NewWalletForm>({
    resolver: zodResolver(newWalletSchema),
    defaultValues: {
      name: '',
      type: 'personal',
      icon: 'wallet',
      color: '#16A085',
      currency_code: 'PYG',
      initial_balance: 0,
      target_date: null,
      budget_alert_pct: null,
      is_private: false,
    },
  });

  const watched = watch();
  const iconDef = WALLET_ICONS.find(i => i.id === watched.icon) || WALLET_ICONS[0];

  async function onSubmit(values: NewWalletForm) {
    setSubmitting(true);
    try {
      await useWallets.getState().create(values);
      router.replace('/');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo crear la wallet');
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Sub-components ----
  const SectionLabel = ({ text }: { text: string }) => (
    <Text style={{
      fontFamily: typography.fontFamily.semibold,
      fontSize: 11,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 10,
      marginTop: 20,
    }}>
      {text}
    </Text>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        {/* App Bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 12,
          borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <Icon name="ChevronLeft" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={{ gap: 2 }}>
            <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 17, color: theme.colors.textPrimary }}>
              Nueva wallet
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 12, color: theme.colors.textSecondary }}>
              {watched.type === 'personal' ? 'Personal' : 'En equipo'}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

          {/* Preview header */}
          <LinearGradient
            colors={[watched.color, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 24,
              marginHorizontal: 16,
              marginTop: 16,
              alignItems: 'center',
              gap: 12,
              ...shadows.cardHi,
            }}
          >
            <View style={{
              width: 64, height: 64, borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={iconDef.lucide} size={32} color="#FFFFFF" />
            </View>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 20, color: '#FFFFFF' }}>
              {watched.name.trim() || 'Mi wallet'}
            </Text>
            <View style={{
              paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}>
              <Text style={{
                fontFamily: typography.fontFamily.semibold, fontSize: 10,
                color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {watched.type === 'personal' ? 'PERSONAL' : 'EN EQUIPO'}
              </Text>
            </View>
            <Text style={{
              fontFamily: typography.fontFamily.medium, fontSize: 12,
              color: 'rgba(255,255,255,0.85)',
            }}>
              {watched.type === 'personal' ? 'Solo vos' : '1 miembro'}
            </Text>
          </LinearGradient>

          <View style={{ paddingHorizontal: 16 }}>

            {/* Tipo de wallet */}
            <SectionLabel text="Tipo" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Personal */}
              <Controller
                control={control}
                name="type"
                render={({ field: { value } }) => (
                  <Pressable
                    onPress={() => setValue('type', 'personal')}
                    style={{
                      flex: 1, padding: 18, borderRadius: 14, gap: 8,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 2,
                      borderColor: value === 'personal' ? theme.colors.primary : theme.colors.border,
                    }}
                  >
                    <Icon name="User" size={22} color={value === 'personal' ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 15, color: theme.colors.textPrimary }}>
                      Personal
                    </Text>
                    <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 12, color: theme.colors.textSecondary }}>
                      Solo para vos
                    </Text>
                  </Pressable>
                )}
              />

              {/* En equipo */}
              <Controller
                control={control}
                name="type"
                render={({ field: { value } }) => (
                  <Pressable
                    onPress={() => setValue('type', 'team')}
                    style={{
                      flex: 1, padding: 18, borderRadius: 14, gap: 8,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 2,
                      borderColor: value === 'team' ? theme.colors.primary : theme.colors.border,
                    }}
                  >
                    <Icon name="Users" size={22} color={value === 'team' ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 15, color: theme.colors.textPrimary }}>
                      En equipo
                    </Text>
                    <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 12, color: theme.colors.textSecondary }}>
                      Compartida con otros
                    </Text>
                  </Pressable>
                )}
              />
            </View>

            {/* Sección Miembros (solo team) */}
            {watched.type === 'team' && (
              <View style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 12,
                backgroundColor: withAlpha(theme.colors.primary, 0.08),
                borderWidth: 1,
                borderColor: withAlpha(theme.colors.primary, 0.2),
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
                <Icon name="Users" size={18} color={theme.colors.primary} />
                <Text style={{
                  flex: 1,
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 12,
                  color: theme.colors.textPrimary,
                  lineHeight: 16,
                }}>
                  Podés invitar miembros después de crear la wallet
                </Text>
              </View>
            )}

            {/* Nombre */}
            <SectionLabel text="Nombre" />
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="NOMBRE"
                  labelTrailing={
                    <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary }}>
                      {value.length}/40
                    </Text>
                  }
                  placeholder="Viaje en familia, Hogar, Ahorros..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={40}
                  returnKeyType="done"
                  error={errors.name?.message}
                />
              )}
            />

            {/* Ícono y color */}
            <SectionLabel text="Ícono y color" />

            {/* Grid 4×2 íconos */}
            <Controller
              control={control}
              name="icon"
              render={({ field: { value } }) => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  {WALLET_ICONS.map((iconDef) => {
                    const selected = value === iconDef.id;
                    return (
                      <Pressable
                        key={iconDef.id}
                        onPress={() => {
                          setValue('icon', iconDef.id as WalletIcon);
                          setValue('color', iconDef.color);
                        }}
                        style={{
                          width: '22%',
                          aspectRatio: 1,
                          borderRadius: 14,
                          borderWidth: selected ? 2.5 : 1,
                          borderColor: selected ? theme.colors.primary : theme.colors.border,
                          backgroundColor: theme.colors.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <IconBox iconName={iconDef.lucide} color={iconDef.color} size={40} />
                        {selected && (
                          <View style={{
                            position: 'absolute', top: 4, right: 4,
                            width: 16, height: 16, borderRadius: 8,
                            backgroundColor: theme.colors.primary,
                            alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon name="Check" size={10} color="#FFFFFF" strokeWidth={2.5} />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />

            {/* Color swatches */}
            <Controller
              control={control}
              name="color"
              render={({ field: { value } }) => (
                <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                  {COLOR_PALETTE.map((hex) => {
                    const selected = value === hex;
                    return (
                      <Pressable
                        key={hex}
                        onPress={() => setValue('color', hex)}
                        style={{
                          width: 28, height: 28, borderRadius: 14,
                          backgroundColor: hex,
                          borderWidth: selected ? 2.5 : 1.5,
                          borderColor: selected ? theme.colors.primary : 'transparent',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {selected && (
                          <View style={{
                            width: 10, height: 10, borderRadius: 5,
                            borderWidth: 2, borderColor: '#FFFFFF',
                          }} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />

            {/* Moneda */}
            <SectionLabel text="Moneda" />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{
                paddingVertical: 10, paddingHorizontal: 18,
                borderRadius: 12, borderWidth: 2,
                borderColor: theme.colors.primary,
                backgroundColor: withAlpha(theme.colors.primary, 0.08),
              }}>
                <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14, color: theme.colors.primary }}>
                  PYG ₲
                </Text>
              </View>
              {['USD $', 'ARS $', 'EUR €'].map(c => (
                <View key={c} style={{
                  paddingVertical: 10, paddingHorizontal: 18,
                  borderRadius: 12, borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  opacity: 0.4,
                }}>
                  <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14, color: theme.colors.textSecondary }}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{
              fontFamily: typography.fontFamily.regular, fontSize: 12,
              color: theme.colors.textSecondary, marginTop: 8,
            }}>
              Tu moneda principal. Podrás cambiarla más adelante.
            </Text>

            {/* Presupuesto inicial */}
            <SectionLabel text="Presupuesto inicial" />
            <Controller
              control={control}
              name="initial_balance"
              render={({ field: { value, onChange } }) => (
                <View>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    gap: 8, padding: 16, borderRadius: 14,
                    borderWidth: 1, borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                  }}>
                    <Text style={{
                      fontFamily: typography.fontFamily.bold,
                      fontSize: 22, color: theme.colors.primary,
                    }}>
                      ₲
                    </Text>
                    <TextInput
                      style={{
                        flex: 1, fontFamily: typography.fontFamily.bold,
                        fontSize: 32, color: theme.colors.textPrimary, padding: 0,
                      }}
                      keyboardType="numeric"
                      value={value === 0 ? '' : value.toLocaleString('es-PY')}
                      onChangeText={(t) => {
                        const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
                        onChange(isNaN(n) ? 0 : n);
                      }}
                      placeholder="0"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  </View>
                  {errors.initial_balance && (
                    <Text style={{ color: theme.colors.danger, fontSize: 11, marginTop: 4 }}>
                      {errors.initial_balance.message}
                    </Text>
                  )}
                  {/* Quick add chips */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {QUICK_ADD_AMOUNTS.map(amt => {
                      const label = amt >= 1_000_000
                        ? `+${amt / 1_000_000}M`
                        : `+${amt / 1_000}k`;
                      return (
                        <Pressable
                          key={amt}
                          onPress={() => onChange(value + amt)}
                          style={{
                            paddingVertical: 8, paddingHorizontal: 12,
                            borderRadius: 999,
                            backgroundColor: withAlpha(theme.colors.primary, 0.1),
                          }}
                        >
                          <Text style={{
                            fontFamily: typography.fontFamily.semibold,
                            fontSize: 12, color: theme.colors.primary,
                          }}>
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={{
                    fontFamily: typography.fontFamily.regular, fontSize: 12,
                    color: theme.colors.textSecondary, marginTop: 8,
                  }}>
                    Puede ser tu meta de ahorro o el monto que asignás. Lo podés cambiar después.
                  </Text>
                </View>
              )}
            />

            {/* Opciones avanzadas */}
            <Pressable
              onPress={() => setAdvancedOpen(p => !p)}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingVertical: 16, marginTop: 8,
                borderTopWidth: 1, borderTopColor: theme.colors.border,
              }}
            >
              <Text style={{
                fontFamily: typography.fontFamily.medium, fontSize: 16,
                color: theme.colors.textPrimary,
              }}>
                Opciones avanzadas
              </Text>
              <Icon
                name={advancedOpen ? 'ChevronUp' : 'ChevronDown'}
                size={20} color={theme.colors.textSecondary}
              />
            </Pressable>

            {advancedOpen && (
              <View style={{ marginBottom: 8 }}>

                {/* Fecha objetivo */}
                <Controller
                  control={control}
                  name="target_date"
                  render={({ field: { value, onChange } }) => (
                    <ToggleRow
                      iconName="Calendar"
                      label="Fecha objetivo"
                      value={!!value}
                      onValueChange={(on) => {
                        if (!on) onChange(null);
                        else setShowDatePicker(true);
                      }}
                    >
                      <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={{
                          paddingVertical: 10, paddingHorizontal: 14,
                          borderRadius: 10, borderWidth: 1,
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.surface,
                        }}
                      >
                        <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: 14, color: theme.colors.textPrimary }}>
                          {value ? new Date(value).toLocaleDateString('es-PY') : 'Elegir fecha'}
                        </Text>
                      </Pressable>
                      {showDatePicker && (
                        <DateTimePicker
                          value={value ? new Date(value) : new Date()}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          minimumDate={new Date()}
                          onChange={(_e, d) => {
                            setShowDatePicker(false);
                            if (d) onChange(d.toISOString().slice(0, 10));
                          }}
                        />
                      )}
                    </ToggleRow>
                  )}
                />

                {/* Aviso de presupuesto */}
                <Controller
                  control={control}
                  name="budget_alert_pct"
                  render={({ field: { value, onChange } }) => (
                    <ToggleRow
                      iconName="Bell"
                      label="Aviso de presupuesto"
                      value={value !== null}
                      onValueChange={(on) => onChange(on ? 80 : null)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 14, color: theme.colors.textSecondary }}>
                          Avisarme al
                        </Text>
                        <TextInput
                          style={{
                            width: 60, paddingVertical: 8, paddingHorizontal: 12,
                            borderRadius: 10, borderWidth: 1,
                            borderColor: theme.colors.border,
                            backgroundColor: theme.colors.surface,
                            fontFamily: typography.fontFamily.semibold,
                            fontSize: 16, color: theme.colors.textPrimary,
                            textAlign: 'center',
                          }}
                          keyboardType="numeric"
                          value={value !== null ? String(value) : '80'}
                          onChangeText={(t) => {
                            const n = parseInt(t, 10);
                            onChange(isNaN(n) ? 80 : Math.min(100, Math.max(1, n)));
                          }}
                          maxLength={3}
                        />
                        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 14, color: theme.colors.textSecondary }}>
                          %
                        </Text>
                      </View>
                    </ToggleRow>
                  )}
                />

                {/* Wallet privada */}
                <Controller
                  control={control}
                  name="is_private"
                  render={({ field: { value, onChange } }) => (
                    <ToggleRow
                      iconName="Lock"
                      label="Wallet privada"
                      subtitle="No aparece en el resumen general"
                      value={value}
                      onValueChange={onChange}
                    />
                  )}
                />

              </View>
            )}
          </View>
        </ScrollView>

        {/* CTA bar */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 16,
          backgroundColor: theme.colors.background,
          borderTopWidth: 1, borderTopColor: theme.colors.border,
          flexDirection: 'row', gap: 12,
        }}>
          <Button
            label="Cancelar"
            variant="outline"
            onPress={() => router.back()}
            style={{ flex: 1 }}
          />
          <Button
            label="Crear wallet"
            variant="primary"
            loading={submitting}
            onPress={handleSubmit(onSubmit)}
            style={{ flex: 2 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
