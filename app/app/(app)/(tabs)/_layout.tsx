import { Tabs } from 'expo-router';
import { BottomNav } from '@/components/BottomNav';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();
  
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const activeRoute = props.state.routes[props.state.index].name;
        
        return (
          <BottomNav
            active={activeRoute as any}
            onPress={(tab) => {
              if (tab === 'add') {
                router.push('/create-wallet');
              } else {
                router.navigate(`/${tab}`);
              }
            }}
          />
        );
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="add" options={{ href: null }} />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
