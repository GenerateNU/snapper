import Expo, { ExpoPushToken } from 'expo-server-sdk';
import mongoose from 'mongoose';
import { UserModel } from '../models/users';

export type PushNotification = {
  to: ExpoPushToken;
  title: string;
  body: string;
  sound?: 'default' | null;
  priority?: 'default' | 'normal' | 'high';
  data?: {
    target?: mongoose.Types.ObjectId;
    targetModel?: 'DiveLog' | 'User';
  };
};

export interface Notification {
  type: 'LIKE' | 'POST' | 'FOLLOW';
  time: Date;
  isRead: boolean;
  message: string;
  receiver: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  target?: mongoose.Types.ObjectId;
  targetModel?: 'DiveLog' | 'User';
}

export interface ExpoService {
  sendPushNotification(notification: PushNotification[]): Promise<any>;
  sendPostNotification(notification: any): Promise<any>;
  sendLikeNotification(notification: any): Promise<any>;
  sendFollowNotification(notification: any): Promise<any>;
}

export class ExpoServiceImpl implements ExpoService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendPushNotification(notifications: PushNotification[]): Promise<any> {
    if (notifications.length > 0) {
      const messages = notifications
        .filter((notification) => Expo.isExpoPushToken(notification.to))
        .map((notification) => ({
          ...notification,
          data: {
            ...notification.data,
          },
        }));

      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
          console.log('Notification sent:', ticketChunk);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }

      return tickets;
    }
    return [];
  }

  async sendPostNotification(notification: Notification): Promise<any> {
    const { message, actor, target, targetModel } = notification;
    const followers = await UserModel.find(
      { following: actor },
      'deviceTokens',
    );
    const deviceTokens = followers.flatMap((follower) => follower.deviceTokens);

    const actorUser = await UserModel.findById(actor);
    const actorName = actorUser ? actorUser.username : 'A user';
    const title = `${actorName} just posted new divelog!`;

    const pushNotifications: PushNotification[] = deviceTokens.map(
      (token: string) => ({
        to: token as ExpoPushToken,
        title,
        body: message,
        sound: 'default',
        priority: 'high',
        data: {
          target,
          targetModel,
        },
      }),
    );

    return this.sendPushNotification(pushNotifications);
  }

  async sendLikeNotification(notification: Notification): Promise<any> {
    const { message, receiver } = notification;

    const user = await UserModel.findById(receiver);
    if (!user) {
      throw new Error('User not found');
    }

    const pushNotifications: PushNotification[] = user.deviceTokens.map(
      (token: string) => ({
        to: token as ExpoPushToken,
        title: 'You have a new like!',
        body: message,
        sound: 'default',
        priority: 'high',
      }),
    );

    return this.sendPushNotification(pushNotifications);
  }

  async sendFollowNotification(notification: Notification): Promise<any> {
    const { message, receiver } = notification;

    const user = await UserModel.findById(receiver);
    if (!user) {
      throw new Error('User not found');
    }

    const pushNotifications: PushNotification[] = user.deviceTokens.map(
      (token: string) => ({
        to: token as ExpoPushToken,
        title: 'You have a new follower!',
        body: message,
        sound: 'default',
        priority: 'high',
      }),
    );

    return this.sendPushNotification(pushNotifications);
  }
}
