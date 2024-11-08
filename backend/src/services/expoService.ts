import { ExpoPushToken } from 'expo-server-sdk';
import mongoose from 'mongoose';
import { UserModel } from '../models/users';

export type PushNotification = {
  to: ExpoPushToken;
  title: string;
  body: string;
  sound?: string;
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
  async sendPushNotification(notification: PushNotification[]): Promise<any> {
    if (notification.length > 0) {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
    }
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
        sound: 'default',
        body: message,
        data: {
          target,
          targetModel,
        },
      }),
    );

    await this.sendPushNotification(pushNotifications);
  }

  async sendLikeNotification(notification: Notification): Promise<any> {
    const message = notification.message;
    const receiver = notification.receiver;

    const user = await UserModel.findById(receiver);
    if (!user) {
      throw new Error('User not found');
    }

    const pushNotifications: PushNotification[] = user.deviceTokens.map(
      (token: string) => ({
        to: token as ExpoPushToken,
        sound: 'default',
        title: 'You have a new like!',
        body: message,
      }),
    );

    await this.sendPushNotification(pushNotifications);
  }

  async sendFollowNotification(notification: Notification): Promise<any> {
    const message = notification.message;
    const receiver = notification.receiver;

    const user = await UserModel.findById(receiver);
    if (!user) {
      throw new Error('User not found');
    }

    const pushNotifications: PushNotification[] = user.deviceTokens.map(
      (token: string) => ({
        to: token as ExpoPushToken,
        sound: 'default',
        title: 'You have a new follower!',
        body: message,
      }),
    );

    await this.sendPushNotification(pushNotifications);
  }
}
