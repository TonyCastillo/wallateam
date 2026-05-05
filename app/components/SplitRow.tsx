import { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Avatar } from './Avatar';
import { LinearGradient } from 'expo-linear-gradient';

const formatPYG = (n: number) => n.toLocaleString('es-PY');

interface SplitRowProps {
  name: string;
  pct: number;
  amount: number;
  isIncluded?: boolean;
  onToggle?: () => void;
  // Props para modos de edición (percent, amount):
  mode?: 'equal' | 'percent' | 'amount';
  onChangeAmount?: (amt: number) => void;
  onChangePct?: (pct: number) => void;
}

export function SplitRow({ name, pct, amount, isIncluded = true, onToggle, mode = 'equal', onChangePct, onChangeAmount }: SplitRowProps) {
  const { theme } = useTheme();

  const [localPct, setLocalPct] = useState(pct === 0 ? '' : String(pct));

  useEffect(() => {
    if (Number(localPct) !== pct) {
      setLocalPct(pct === 0 ? '' : String(pct));
    }
  }, [pct]);

  return (
    <Pressable
      onPress={onToggle}
      disabled={!onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        opacity: isIncluded ? 1 : 0.4,
      }}
    >
      <Avatar name={name} size={32} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semibold,
            fontSize: 13,
            color: theme.colors.textPrimary,
          }}
        >
          {name}
        </Text>
        <View
          style={{
            height: 5,
            marginTop: 5,
            borderRadius: 3,
            backgroundColor: theme.colors.background,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, height: '100%' }}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, minWidth: 70, justifyContent: 'flex-end' }}>
        {mode === 'percent' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: theme.colors.primary, paddingBottom: 2 }}>
            <TextInput
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 16,
                color: theme.colors.textPrimary,
                textAlign: 'right',
                padding: 0,
                minWidth: 40,
              }}
              keyboardType="numeric"
              value={localPct}
              placeholder="0"
              placeholderTextColor={theme.colors.textSecondary}
              onChangeText={(txt) => {
                const cleaned = txt.replace(/[^0-9.]/g, '');
                setLocalPct(cleaned);
                const val = cleaned === '' ? 0 : Number(cleaned);
                if (!isNaN(val)) {
                  onChangePct?.(val);
                }
              }}
            />
          </View>
        ) : (
          <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: 16, color: theme.colors.textPrimary }}>
            {Number(pct.toFixed(1))}
          </Text>
        )}
        <Text style={{ fontFamily: typography.fontFamily.semibold, fontSize: 11, color: theme.colors.textSecondary }}>
          %
        </Text>
      </View>
      <View style={{ minWidth: 64, alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: 11, color: theme.colors.textSecondary }}>
          {amount > 0 ? formatPYG(Math.round(amount)) : '0'}
        </Text>
      </View>
    </Pressable>
  );
}
