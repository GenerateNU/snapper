import { Document } from 'mongoose';
import { Notification } from '../models/notification';
import { UserModel } from '../models/users';
import { DiveLog } from '../models/diveLog';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../consts/pagination';
import { NotFoundError } from '../consts/errors';

export interface NotificationService {
  /**
   * Creates a notification for a "like" action.
   *
   * @param actorId - The ID of the user who performed the like action.
   * @param receiverId - The ID of the user who will receive the notification.
   * @param diveLogId - The ID of the dive log that was liked.
   * @returns A promise that resolves to the created notification document or null.
   */
  createLikeNotification(
    actorId: string,
    receiverId: string,
    diveLogId: string,
  ): Promise<Document | null>;

  /**
   * Creates a notification for a "follow" action.
   *
   * @param actorId - The ID of the user who performed the follow action.
   * @param receiverId - The ID of the user who will receive the notification.
   * @returns A promise that resolves to the created notification document or null.
   */
  createFollowNotification(
    actorId: string,
    receiverId: string,
  ): Promise<Document | null>;

  /**
   * Creates a notification for a new post.
   *
   * @param actorId - The ID of the user who created the post.
   * @param diveLogId - The ID of the dive log that was posted.
   * @returns A promise that resolves to an array of created notification documents.
   */
  createPostNotification(
    actorId: string,
    diveLogId: string,
  ): Promise<Document[]>;

  /**
   * Retrieves notifications for a specific user.
   *
   * @param userId - The ID of the user whose notifications are being retrieved.
   * @param limit - The maximum number of notifications to retrieve.
   * @param page - The page number for pagination.
   * @returns A promise that resolves to an array of notification documents.
   */
  getUserNotification(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[]>;

  /**
   * Clears all notifications.
   *
   * @returns A promise that resolves when all notifications have been cleared.
   */
  clearAllNotification(): Promise<void>;
}

export class NotificationServiceImpl implements NotificationService {
  async createNotification({
    type,
    actorId,
    receiverId,
    targetId,
    targetModel,
    message,
    upsert = false,
  }: {
    type: string;
    actorId: string;
    receiverId: string;
    targetId: string;
    targetModel: string;
    message: string;
    upsert?: boolean;
  }): Promise<Document | null> {
    const actor = await UserModel.findById(actorId).select('username');

    if (!actor) {
      throw new NotFoundError('Actor not found');
    }

    // does not send notification if like one's own post
    if (type === 'LIKE' && actorId === receiverId) {
      return null;
    }

    // does not send notification if like then unlike
    if (type === 'LIKE') {
      const existingNotification = await Notification.findOne({
        type,
        receiver: receiverId,
        actor: actorId,
        target: targetId,
        targetModel,
      });
      if (existingNotification) {
        return null;
      }
    }

    let notificationMessage = `${actor.username} ${message}`;

    const notificationData = {
      type,
      message: notificationMessage,
      receiver: receiverId,
      actor: actorId,
      target: targetId,
      targetModel,
    };

    let notification;
    if (upsert) {
      notification = await Notification.findOneAndUpdate(
        {
          type,
          receiver: receiverId,
          actor: actorId,
          target: targetId,
          targetModel,
        },
        {
          $set: notificationData,
        },
        { new: true, upsert: true },
      );
    } else {
      notification = new Notification(notificationData);
      notification = await notification.save();
    }

    return notification;
  }

  async createLikeNotification(
    actorId: string,
    receiverId: string,
    diveLogId: string,
  ): Promise<Document | null> {
    return this.createNotification({
      type: 'LIKE',
      actorId,
      receiverId,
      targetId: diveLogId,
      targetModel: 'DiveLog',
      message: 'liked your post.',
    });
  }

  async createFollowNotification(
    actorId: string,
    receiverId: string,
  ): Promise<Document | null> {
    return this.createNotification({
      type: 'FOLLOW',
      actorId,
      receiverId,
      targetId: receiverId,
      targetModel: 'User',
      message: 'just followed you.',
      upsert: true,
    });
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

    const speciesNames: string =
      diveLog.speciesTags
        .map((species: { commonNames: string[] }) => species.commonNames[0])
        .join(', ') || null;

    const message = speciesNames
      ? `${speciesNames} was found by ${actor.username}!`
      : `${actor.username} just went on a dive!`;

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
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

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
