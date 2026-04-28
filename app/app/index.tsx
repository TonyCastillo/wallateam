import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { text } from '@/theme/typography';
import { supabase } from '@/lib/supabase';
import { fmtGs, fmtGsCompact } from '@/lib/format';

type Status =
  | { kind: 'loading' }
  | { kind: 'ok'; codes: string }
  | { kind: 'error'; msg: string };

export default function Index() {
  const { theme } = useTheme();
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  useEffect(() => {
    supabase
      .from('currencies')
      .select('code')
      .order('code')
      .then(({ data, error }) => {
        if (error) {
          setStatus({ kind: 'error', msg: error.message });
        } else {
          setStatus({ kind: 'ok', codes: data?.map((c) => c.code).join(', ') ?? '(empty)' });
        }
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        padding: 24,
        gap: 12,
      }}
    >
      <Text style={[text.bold, { color: theme.colors.textPrimary, fontSize: 22 }]}>
        Smoke test Supabase
      </Text>

      {status.kind === 'loading' && (
        <Text style={[text.regular, { color: theme.colors.textSecondary }]}>cargando…</Text>
      )}
      {status.kind === 'ok' && (
        <Text style={[text.medium, { color: theme.colors.success, textAlign: 'center' }]}>
          OK · currencies: {status.codes}
        </Text>
      )}
      {status.kind === 'error' && (
        <Text style={[text.medium, { color: theme.colors.danger, textAlign: 'center' }]}>
          ERROR: {status.msg}
        </Text>
      )}

      <View style={{ height: 16 }} />
      <Text style={[text.semibold, { color: theme.colors.textPrimary }]}>
        Formato PYG (smoke test)
      </Text>
      <Text style={[text.regular, { color: theme.colors.textSecondary }]}>
        2.000.000 → {fmtGs(2_000_000)}
      </Text>
      <Text style={[text.regular, { color: theme.colors.textSecondary }]}>
        compacto → {fmtGsCompact(1_200_000)} · {fmtGsCompact(500_000)}
      </Text>
    </View>
  );
}
