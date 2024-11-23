import express from 'express';
import {
  DiveLogService,
  DiveLogServiceImpl,
} from '../../services/divelogService';
import {
  NotificationService,
  NotificationServiceImpl,
} from '../../services/notificationService';
import { ExpoService, ExpoServiceImpl } from '../../services/expoService';
import { NotFoundError } from '../../consts/errors';
import { ObjectId } from 'mongodb';

const divelogService: DiveLogService = new DiveLogServiceImpl();
const notificationService: NotificationService = new NotificationServiceImpl();
const expoService: ExpoService = new ExpoServiceImpl();

export const toggleLikeDivelog = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id: likeUserId, divelogId } = req.params;

    if (!divelogId || !likeUserId) {
      return res
        .status(400)
        .json({ error: 'User ID or dive log ID is missing' });
    }

    if (!ObjectId.isValid(likeUserId) || !ObjectId.isValid(divelogId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const divelog: any = await divelogService.toggleLikeDiveLog(
      likeUserId,
      divelogId,
    );

    if (divelog.likes.includes(likeUserId)) {
      const notification = await notificationService.createLikeNotification(
        likeUserId,
        divelog.user._id.toString(),
        divelog._id,
      );
      if (notification) {
        await expoService.sendLikeNotification(notification);
      }
      return res.status(200).json({ message: 'Dive log liked successfully.' });
    } else {
      return res
        .status(200)
        .json({ message: 'Dive log unliked successfully.' });
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'An error occurred while toggling like status.' });
  }
};
