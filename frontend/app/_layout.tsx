import { router, Stack } from 'expo-router';
import { AppState, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../auth/authProvider';
import { useEffect } from 'react';
import { useAuthStore } from '../auth/authStore';
import { NavBar } from './(app)/(components)/navbar';
import { InfoPopupProvider } from '../contexts/info-popup-context';

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
    <View className="h-full w-full flex flex-col">
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(postcreation)" options={{ headerShown: false }} />
      </Stack>
      {isAuthenticated && <NavBar />}
    </View>
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
        <InfoPopupProvider>
          <StatusBar />
          <InitialLayout />
        </InfoPopupProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
