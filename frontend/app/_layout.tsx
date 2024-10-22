import { router, Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../auth/authProvider';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/(app)');
    } else {
      router.push('/(auth)/');
    }
  }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar />
        <InitialLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
