import { Document } from 'mongoose';
import { Notification } from '../models/notification';
import { UserModel } from '../models/users';
import { DiveLog } from '../models/diveLog';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../consts/pagination';
import { NotFoundError } from '../consts/errors';

export interface NotificationService {
  createLikeNotification(
    actorId: string,
    receiverId: string,
    diveLogId: string,
  ): Promise<Document | null>;
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
  ): Promise<Document | null> {

    const actor = await UserModel.findById(actorId).select('username');
    if (!actor) {
      throw new NotFoundError('Actor not found');
    }

    if (actorId === receiverId) {
      return null;
    }

    const existingNotification = await Notification.findOne({
      type: 'LIKE',
      receiver: receiverId,
      actor: actorId,
      target: diveLogId,
      targetModel: 'DiveLog',
    });

    if (existingNotification) {
      return null;
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
      throw new NotFoundError('Actor not found');
    }

    const message = `${actor.username} started following you.`;

    const notification = await Notification.findOneAndUpdate(
      {
        type: 'FOLLOW',
        receiver: receiverId,
        actor: actorId,
        target: receiverId,
        targetModel: 'User',
      },
      {
        $set: {
          message,
          time: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return notification;
  }

  async createPostNotification(
    actorId: string,
    diveLogId: string,
  ): Promise<Document[]> {
    const actor =
      await UserModel.findById(actorId).select('username followers');
    if (!actor) {
      throw new NotFoundError('Actor not found');
    }

    const diveLog: any = await DiveLog.findById(diveLogId)
      .populate({
        path: 'speciesTags',
        select: 'commonNames',
      })
      .exec();

    if (!diveLog) {
      throw new NotFoundError('DiveLog not found');
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
    limit: number = DEFAULT_LIMIT,
    page: number = DEFAULT_PAGE,
  ): Promise<Document[]> {
    const notifications = await Notification.find({ receiver: userId })
      .sort({ time: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('actor', 'username profilePicture')
      .populate('target', 'photos')
      .exec();
    return notifications;
  }

  async clearAllNotification(): Promise<void> {
    await Notification.deleteMany({});
  }
}
