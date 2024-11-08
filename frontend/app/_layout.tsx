import { router, Stack } from 'expo-router';
import { AppState, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../auth/authProvider';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../auth/authStore';
import { InfoPopupProvider } from '../contexts/info-popup-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  unregisterForPushNotifications,
} from '../utils/notification';
import { NOTIFICATION_TOKEN_KEY } from '../consts/notification';
import { NotificationProvider } from '../contexts/notification';

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const notificationTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/(app)');
    } else {
      router.push('/(auth)/');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let subscription: any;

    const handleNotificationPermissions = async () => {
      try {
        if (!user?.supabaseId) return;

        const { status } = await Notifications.getPermissionsAsync();
        const savedToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);

        if (status === 'granted') {
          // register for notifications if user does not have a token
          if (!savedToken) {
            const token = await registerForPushNotifications(user.supabaseId);
            if (token) {
              await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
              notificationTokenRef.current = token;
            }
          } else {
            notificationTokenRef.current = savedToken;
          }
        } else {
          // unregister if permissions are revoked and have a saved token
          if (savedToken) {
            await unregisterForPushNotifications(user.supabaseId, savedToken);
            await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
            notificationTokenRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error handling notification permissions:', error);
      }
    };

    if (isAuthenticated && user?.supabaseId) {
      handleNotificationPermissions();
      subscription = Notifications.addNotificationResponseReceivedListener(
        () => {
          handleNotificationPermissions();
        },
      );
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isAuthenticated, user?.supabaseId]);

  useEffect(() => {
    const cleanupNotifications = async () => {
      if (
        !isAuthenticated &&
        notificationTokenRef.current &&
        user?.supabaseId
      ) {
        try {
          await unregisterForPushNotifications(
            user.supabaseId,
            notificationTokenRef.current,
          );
          await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
          notificationTokenRef.current = null;
        } catch (error) {
          console.error('Error cleaning up notifications:', error);
        }
      }
    };

    cleanupNotifications();
  }, [isAuthenticated, user?.supabaseId]);

  return (
    <View className="h-full w-full flex flex-col">
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
