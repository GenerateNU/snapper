import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';
import {
  NotificationService,
  NotificationServiceImpl,
} from '../../services/notificationService';
import express from 'express';
import { NotFoundError } from '../../consts/errors';

const notificationService: NotificationService = new NotificationServiceImpl();

export const getNotifications = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (limit <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ error: 'Limit and page must be greater than 0' });
    }

    const notifications = await notificationService.getUserNotification(
      userId,
      limit,
      page,
    );
    return res.status(200).json(notifications);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching notifications.' });
  }
};
