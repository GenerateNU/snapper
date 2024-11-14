import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { Expo } from 'expo-server-sdk';
import { NotFoundError } from '../../consts/errors';

const userService: UserService = new UserServiceImpl();

export const ExpoTokenController = {
  async handleExpoToken(
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response> {
    try {
      const { id: userId } = req.params;
      const { token } = req.body;

      if (!userId || !token) {
        return res
          .status(400)
          .json({ error: 'User ID and device token is required' });
      }

      if (!Expo.isExpoPushToken(token)) {
        return res.status(400).json({ error: 'Invalid Expo push token' });
      }

      const updatedUser = await userService.updateDeviceToken(
        userId,
        token,
      );

      return res.status(200).json({ message: updatedUser });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({
        error: 'An error occurred while processing Expo token',
      });
    }
  },
};
