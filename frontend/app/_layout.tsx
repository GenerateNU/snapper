import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from '../auth/authProvider';
import { useAuthStore } from '../auth/authStore';
import { InfoPopupProvider } from '../contexts/info-popup-context';
import { NotificationProvider } from '../contexts/notification';
import { useNotificationPermission } from '../hooks/notification';
import { useLocationPermission } from '../hooks/location';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { isAuthenticated, mongoDBId, refreshSession } = useAuth();

  useEffect(() => {
    const refresh = async () => {
      await refreshSession();
      if (isAuthenticated) {
        router.push('/(app)');
      } else {
        router.push('/(auth)/');
      }
    };
    refresh();
  }, [isAuthenticated]);

  useNotificationPermission({ isAuthenticated, mongoDBId });

  useLocationPermission();

  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(app)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
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
        <NotificationProvider>
          <InfoPopupProvider>
            <StatusBar />
            <InitialLayout />
          </InfoPopupProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
