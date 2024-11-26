import Expo, { ExpoPushToken } from 'expo-server-sdk';
import mongoose from 'mongoose';
import { UserModel } from '../models/users';
import { NotFoundError } from '../consts/errors';

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
  /**
   * Sends a push notification.
   *
   * @param notification - An array of PushNotification objects to be sent.
   * @returns A promise that resolves when the notification has been sent.
   */
  sendPushNotification(notification: PushNotification[]): Promise<any>;

  /**
   * Sends a post notification.
   *
   * @param notification - The notification data to be sent.
   * @returns A promise that resolves when the notification has been sent.
   */
  sendPostNotification(notification: any): Promise<any>;

  /**
   * Sends a like notification.
   *
   * @param notification - The notification data to be sent.
   * @returns A promise that resolves when the notification has been sent.
   */
  sendLikeNotification(notification: any): Promise<any>;

  /**
   * Sends a follow notification.
   *
   * @param notification - The notification data to be sent.
   * @returns A promise that resolves when the notification has been sent.
   */
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
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
      return tickets;
    }
    return [];
  }

  async validatePostNotificationData(
    notification: Notification,
    session: mongoose.mongo.ClientSession,
  ): Promise<{
    actorUser: mongoose.Document & { username: string };
    targetExists: mongoose.Document;
  }> {
    const { actor, target, targetModel } = notification;

    const actorUser = await UserModel.findById(actor, 'username').session(
      session,
    );
    if (!actorUser) {
      throw new NotFoundError('Actor not found');
    }

    if (!targetModel) {
      throw new NotFoundError('Target model is not specified');
    }

    const targetExists = await mongoose
      .model(targetModel)
      .findById(target)
      .session(session);
    if (!targetExists) {
      throw new NotFoundError(`${targetModel} with the given ID not found`);
    }

    return { actorUser, targetExists };
  }

  async getFollowersDeviceTokens(
    actor: string,
    session: mongoose.mongo.ClientSession,
  ): Promise<string[]> {
    const followers = await UserModel.find(
      { following: actor },
      'deviceTokens',
    ).session(session);
    return followers.flatMap((follower) => follower.deviceTokens);
  }

  async buildPushNotifications(
    deviceTokens: string[],
    title: string,
    message: string,
    data?: { target: mongoose.Types.ObjectId; targetModel: 'DiveLog' | 'User' },
  ): Promise<PushNotification[]> {
    return deviceTokens.map(
      (token: string): PushNotification => ({
        to: token as ExpoPushToken,
        title,
        body: message,
        sound: 'default',
        priority: 'high',
        ...(data && { data }),
      }),
    );
  }

  async sendPostNotification(notification: Notification): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { actorUser } = await this.validatePostNotificationData(
        notification,
        session,
      );
      const deviceTokens = await this.getFollowersDeviceTokens(
        notification.actor.toString(),
        session,
      );

      const actorName = actorUser.username || 'A user';
      const title = `${actorName} just posted a new divelog!`;

      const pushNotifications = await this.buildPushNotifications(
        deviceTokens,
        title,
        notification.message,
        {
          target: notification.target!,
          targetModel: notification.targetModel!,
        },
      );

      await session.commitTransaction();
      return this.sendPushNotification(pushNotifications);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async sendLikeNotification(notification: Notification): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { message, receiver } = notification;

      const user = await UserModel.findById(receiver);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const pushNotifications: PushNotification[] =
        await this.buildPushNotifications(
          user.deviceTokens,
          'You have a new like!',
          message,
        );

      return this.sendPushNotification(pushNotifications);
    } catch (error) {
      session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async sendFollowNotification(notification: Notification): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { message, receiver } = notification;

      const user = await UserModel.findById(receiver);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const pushNotifications: PushNotification[] =
        await this.buildPushNotifications(
          user.deviceTokens,
          'You have a new follower!',
          message,
        );
      return this.sendPushNotification(pushNotifications);
    } catch (error) {
      session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
