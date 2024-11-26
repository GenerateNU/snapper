import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import {
  registerForPushNotifications,
  unregisterForPushNotifications,
} from '../utils/notification';
import { NOTIFICATION_TOKEN_KEY } from '../consts/notification';

interface UseNotificationsProps {
  isAuthenticated: boolean;
  mongoDBId: string | null;
}

export const useNotificationPermission = ({
  isAuthenticated,
  mongoDBId,
}: UseNotificationsProps) => {
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null,
  );
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const handleNotificationPermissions = useCallback(async () => {
    try {
      if (!mongoDBId) {
        throw new Error('ID does not exist');
      }

      const { status: currentStatus } =
        await Notifications.getPermissionsAsync();
      const savedToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY);

      if (currentStatus === 'granted') {
        if (!savedToken) {
          const token = await registerForPushNotifications(mongoDBId);
          console.log('Successfully registered for notification');
          if (token) {
            await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, token);
            setNotificationToken(token); // Update state to trigger re-render
          }
        } else {
          setNotificationToken(savedToken); // Use the saved token from AsyncStorage
        }
      } else {
        if (savedToken) {
          await unregisterForPushNotifications(mongoDBId, savedToken);
          console.log('Successfully unregistered for notification');
          await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY);
          setNotificationToken(null); // Reset the token
        }
      }
      setPermissionStatus(currentStatus); // Store the permission status
    } catch (error) {
      console.error('Error handling notification permissions:', error);
    }
  }, [mongoDBId]);

  useEffect(() => {
    if (isAuthenticated && mongoDBId) {
      handleNotificationPermissions();

      const permissionSubscription =
        Notifications.addNotificationResponseReceivedListener(
          handleNotificationPermissions,
        );

      const checkPermissionStatus = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        handleNotificationPermissions();
      };

      const appStateSubscription = AppState.addEventListener(
        'change',
        (nextAppState) => {
          if (nextAppState === 'active') {
            checkPermissionStatus();
          }
        },
      );

      return () => {
        permissionSubscription.remove();
        appStateSubscription.remove();
      };
    }
  }, [isAuthenticated, mongoDBId, handleNotificationPermissions]);

  return {
    notificationToken,
    permissionStatus,
    handleNotificationPermissions,
  };
};
