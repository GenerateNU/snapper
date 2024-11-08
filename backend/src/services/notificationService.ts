import { Document } from 'mongoose';
import { Notification } from '../models/notification';
import { UserModel } from '../models/users';
import { DiveLog } from '../models/diveLog';
import { Expo } from 'expo-server-sdk';

export interface NotificationService {
  createLikeNotification(
    actorId: string,
    receiverId: string,
    diveLogId: string,
  ): Promise<Document>;
  createFollowNotification(
    actorId: string,
    receiverId: string,
  ): Promise<Document>;
  createPostNotification(
    actorId: string,
    diveLogId: string,
  ): Promise<Document[]>;
  getUserNotification(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[]>;
  clearAllNotification(): Promise<void>;
}

export class NotificationServiceImpl implements NotificationService {
  async createLikeNotification(
    actorId: string,
    receiverId: string,
    diveLogId: string,
  ): Promise<Document> {
    const actor = await UserModel.findById(actorId).select('username');
    if (!actor) {
      throw new Error('Actor not found');
    }

    const message = `${actor.username} liked your post.`;

    const notification = new Notification({
      type: 'LIKE',
      message,
      receiver: receiverId,
      actor: actorId,
      target: diveLogId,
      targetModel: 'DiveLog',
    });
    return notification.save();
  }

  async createFollowNotification(
    actorId: string,
    receiverId: string,
  ): Promise<Document> {
    const actor = await UserModel.findById(actorId).select('username');
    if (!actor) {
      throw new Error('Actor not found');
    }

    const message = `${actor.username} started following you.`;

    const notification = new Notification({
      type: 'FOLLOW',
      message,
      receiver: receiverId,
      actor: actorId,
      target: receiverId,
      targetModel: 'User',
    });
    return notification.save();
  }

  async createPostNotification(
    actorId: string,
    diveLogId: string,
  ): Promise<Document[]> {
    const actor =
      await UserModel.findById(actorId).select('username followers');
    if (!actor) {
      throw new Error('Actor not found');
    }

    const diveLog: any = await DiveLog.findById(diveLogId)
      .populate({
        path: 'speciesTags',
        select: 'commonNames',
      })
      .exec();

    if (!diveLog) {
      throw new Error('DiveLog not found');
    }

    const speciesNames =
      diveLog.speciesTags
        .map((species: { commonNames: string[] }) => species.commonNames[0])
        .join(', ') || 'a mysterious marine animal';

    const message = `${speciesNames} was found by ${actor.username}!`;

    const notifications = actor.followers.map((followerId: any) => ({
      type: 'POST',
      message,
      receiver: followerId,
      actor: actorId,
      target: diveLogId,
      targetModel: 'DiveLog',
    }));

    return Notification.insertMany(notifications);
  }

  async getUserNotification(
    userId: string,
    limit: number = 10,
    page: number = 1,
  ): Promise<Document[]> {
    const notifications = await Notification.find({ receiver: userId })
      .sort({ time: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('actor', 'supabaseId username profilePicture')
      .exec();
    return notifications;
  }

  async clearAllNotification(): Promise<void> {
    await Notification.deleteMany({});
  }
}
