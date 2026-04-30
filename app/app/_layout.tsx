import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/stores/auth';
import { useWallets } from '@/stores/wallets';
import { useExpenses } from '@/stores/expenses';

SplashScreen.preventAutoHideAsync().catch(() => {});

function StatusBarWithTheme() {
  const { theme } = useTheme();
  return <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />;
}

function AuthGate() {
  const segments = useSegments();
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const hydrated = useAuth((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth) {
      router.replace('/');
    }
  }, [session, hydrated, segments, router]);

  const fetchAllWallets = useWallets((s) => s.fetchAll);
  const fetchAllExpenses = useExpenses((s) => s.fetchAll);
  useEffect(() => {
    if (session) {
      fetchAllWallets();
      fetchAllExpenses();
    }
  }, [session, fetchAllWallets, fetchAllExpenses]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBarWithTheme />
        <AuthGate />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
