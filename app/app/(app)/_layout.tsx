import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create-wallet" options={{ presentation: 'modal' }} />
      <Stack.Screen name="wallet/[id]" />
    </Stack>
  );
}
