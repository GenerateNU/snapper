import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

type NotificationData = {
  title?: string;
  body?: string;
  data?: {
    targetModel?: 'DiveLog' | 'User';
    target?: string;
  };
};

type NotificationContextType = {
  lastNotification: NotificationData | null;
  clearLastNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  lastNotification: null,
  clearLastNotification: () => {},
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lastNotification, setLastNotification] =
    useState<NotificationData | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const title: string | undefined =
          notification.request.content.title ?? undefined;
        const body: string | undefined =
          notification.request.content.body ?? undefined;
        const data: any = notification.request.content.data ?? undefined;
        setLastNotification({ title, body, data });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data && data.targetModel && data.target) {
          // navigate to divelog page if notification is DiveLog
          if (data.targetModel === 'DiveLog') {
            router.push(`/divelog/${data.target}`);
          }
        }
        // navigate to notification page if notification is related to user follow or like
        else {
          router.push('/(tabs)/notification');
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const clearLastNotification = () => {
    setLastNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        lastNotification,
        clearLastNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};
