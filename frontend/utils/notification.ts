import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { manageExpoToken } from '../api/notification';
import Constants from 'expo-constants';

export async function registerForPushNotifications(id: string) {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })
    ).data;

    const response = await manageExpoToken(token, id);
    if (response.success) {
      console.log(response.message);
    } else {
      console.error('Failed to save token:', response.error);
    }

    return token;
  } else {
    alert('Must use physical device for Push Notifications');
  }
}

export async function unregisterForPushNotifications(
  id: string,
  token: string,
) {
  try {
    const response = await manageExpoToken(token, id);
    if (response.success) {
      console.log(response.message);
    } else {
      console.error('Failed to delete token:', response.error);
    }
  } catch (error) {
    console.error('Error unregistering for push notifications:', error);
  }
}
