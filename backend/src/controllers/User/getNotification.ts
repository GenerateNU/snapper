import { findUserBySupabaseId } from '../../services/userService';
import {
  NotificationService,
  NotificationServiceImpl,
} from './../../services/notificationService';
import express from 'express';

const notificationService: NotificationService = new NotificationServiceImpl();

export const getNotifications = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const user = await findUserBySupabaseId(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userMongoDBId = user._id.toString();

    if (limit <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ error: 'Limit and page must be greater than 0' });
    }

    const notifications = await notificationService.getUserNotification(
      userMongoDBId,
      limit,
      page,
    );

    // await notificationService.clearAllNotification();

    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching notifications.' });
  }
};
