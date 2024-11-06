import { findUserBySupabaseId } from '../../services/userService';
import express from 'express';
import {
  DiveLogService,
  DiveLogServiceImpl,
} from '../../services/divelogService';
import {
  NotificationService,
  NotificationServiceImpl,
} from '../../services/notificationService';

const divelogService: DiveLogService = new DiveLogServiceImpl();
const notificationService: NotificationService = new NotificationServiceImpl();

export const toggleLikeDivelog = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id: currentUserId, divelogId } = req.params;

    if (!divelogId || !currentUserId) {
      return res
        .status(400)
        .json({ error: 'User ID or dive log ID is missing' });
    }

    const currentUserInMongoDB = await findUserBySupabaseId(currentUserId);
    if (!currentUserInMongoDB) {
      return res.status(404).json({ error: 'Current user not found.' });
    }

    const divelog: any = await divelogService.getDiveLogById(divelogId);

    if (!divelog) {
      return res.status(404).json({ error: 'Dive log not found.' });
    }

    const currentUserMongoId = currentUserInMongoDB._id.toString();

    const alreadyLiked = divelog.likes.includes(currentUserMongoId);

    if (alreadyLiked) {
      // unlike if already liked
      await divelogService.unlikeDiveLog(currentUserMongoId, divelogId);
      return res
        .status(200)
        .json({ message: 'Dive log unliked successfully.' });
    } 
    else {
      // like if not already liked
      await divelogService.likeDiveLog(currentUserMongoId, divelogId);
      await notificationService.createLikeNotification(
        currentUserMongoId,
        divelog.user,
        divelog._id,
      );
      return res.status(200).json({ message: 'Dive log liked successfully.' });
    }
  } catch (error) {
    console.error('Error toggling like status:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while toggling like status.' });
  }
};
