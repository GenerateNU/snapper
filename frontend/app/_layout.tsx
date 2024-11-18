import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { router, Stack } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from '../auth/authProvider';
import { useAuthStore } from '../auth/authStore';
import { NOTIFICATION_TOKEN_KEY } from '../consts/notification';
import { InfoPopupProvider } from '../contexts/info-popup-context';
import { NotificationProvider } from '../contexts/notification';
import {
  registerForPushNotifications,
  unregisterForPushNotifications,
} from '../utils/notification';

const queryClient = new QueryClient();

const InitialLayout = () => {
  const { isAuthenticated, mongoDBId } = useAuth();
  const notificationTokenRef = useRef<string | null>(null);
  const permissionSubscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/(app)');
    } else {
      router.push('/(auth)/');
    }
  }, [isAuthenticated]);

  const handleNotificationPermissions = useCallback(async () => {
    try {
      if (!mongoDBId) {
        throw new Error("ID does not exist");
      }

      const { status: currentStatus } = await Notifications.getPermissionsAsync();
      const savedToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);


      if (currentStatus === 'granted') {
        if (!savedToken) {
          console.log('Registering for notifications...');
          const token = await registerForPushNotifications(mongoDBId);
          if (token) {
            await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
            notificationTokenRef.current = token;
          }
        } else {
          notificationTokenRef.current = savedToken;
        }
      } else {
        console.log('Permissions not granted, cleaning up...');
        if (savedToken) {
          await unregisterForPushNotifications(mongoDBId, savedToken);
          await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
          notificationTokenRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error handling notification permissions:', error);
    }
  }, [mongoDBId]);

  useEffect(() => {
    if (isAuthenticated && mongoDBId) {
      // Initial permission check
      handleNotificationPermissions();

      // Set up permission change listener
      permissionSubscriptionRef.current = Notifications.addNotificationResponseReceivedListener(
        handleNotificationPermissions
      );

      // Add permission status change listener
      const checkPermissionStatus = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        handleNotificationPermissions();
      };

      // Check permissions when app comes to foreground
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          checkPermissionStatus();
        }
      });

      return () => {
        if (permissionSubscriptionRef.current) {
          permissionSubscriptionRef.current.remove();
        }
        subscription.remove();
      };
    }
  }, [isAuthenticated, mongoDBId, handleNotificationPermissions]);

  useEffect(() => {
    const cleanupNotifications = async () => {
      if (!isAuthenticated && notificationTokenRef.current && mongoDBId) {
        try {
          console.log("Unregistering device token...");
          await unregisterForPushNotifications(
            mongoDBId,
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
  }, [isAuthenticated, mongoDBId]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
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
