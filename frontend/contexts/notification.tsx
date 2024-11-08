import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';

type NotificationData = {
  title?: string,
  body?: string,
  data?: string
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

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        const data = notification.request.content.data as NotificationData;
        console.log('Received notification:', data);
        setLastNotification(data);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data as NotificationData;
        console.log('Notification response:', data);
        setLastNotification(data);
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
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
        clearLastNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};