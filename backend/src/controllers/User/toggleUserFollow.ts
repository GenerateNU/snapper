import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import {
  NotificationService,
  NotificationServiceImpl,
} from '../../services/notificationService';
import { ExpoService, ExpoServiceImpl } from '../../services/expoService';
import { NotFoundError } from '../../consts/errors';

const notificationService: NotificationService = new NotificationServiceImpl();
const userService: UserService = new UserServiceImpl();
const expoService: ExpoService = new ExpoServiceImpl();

export const toggleUserFollow = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const currentUserId = req.params.id;
    const targetUserId = req.params.userid;

    if (!currentUserId || !targetUserId) {
      return res
        .status(400)
        .json({ error: 'User ID is required' });
    }

    const followUser: any = await userService.toggleFollow(currentUserId, targetUserId);

    const isFollowing = followUser.following.includes(targetUserId);

    if (isFollowing) {
      const notification = await notificationService.createFollowNotification(
        currentUserId,
        targetUserId,
      );
      if (notification) {
        await expoService.sendFollowNotification(notification);
      }
      return res
        .status(200)
        .json({ message: 'Successfully followed the user.' });
    } else {      
      return res
        .status(200)
        .json({ message: 'Successfully unfollowed the user.' });
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'An error occurred while toggling follow status.' });
  }
};
