import { router, Stack } from 'expo-router';
import { AppState, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../auth/authProvider';
import { useEffect } from 'react';
import { useAuthStore } from '../auth/authStore';

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
      <Stack.Screen name="(postcreation)" />

    </Stack>
  );
};

const RootLayout = () => {
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        clearError();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [clearError]);

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
