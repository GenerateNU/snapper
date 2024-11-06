import express from 'express';
import { findUserBySupabaseId } from '../../services/userService';
import { UserService, UserServiceImpl } from '../../services/userService';
import { Expo } from 'expo-server-sdk';

export class ExpoTokenController {
  private userService: UserService;

  constructor() {
    this.userService = new UserServiceImpl();
  }

  async saveExpoToken(
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response> {
    try {
      const userId = req.params.id;
      const { token } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await findUserBySupabaseId(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!Expo.isExpoPushToken(token)) {
        return res.status(400).json({ error: 'Invalid Expo Push Token' });
      }

      await this.userService.saveExpoToken(userId, token);
      return res
        .status(200)
        .json({ message: 'Device token stored successfully' });
    } catch (error) {
      console.error('Error saving device token:', error);
      return res
        .status(500)
        .json({ error: 'An error occurred while saving device token.' });
    }
  }

  async deleteExpoToken(
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response> {
    try {
      const userId = req.params.id;
      const { token } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      if (!Expo.isExpoPushToken(token)) {
        return res.status(400).json({ error: 'Invalid Expo Push Token' });
      }

      const user = await findUserBySupabaseId(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await this.userService.removeExpoToken(userId, token);
      return res
        .status(200)
        .json({ message: 'Device token removed successfully' });
    } catch (error) {
      console.error('Error removing device token:', error);
      return res
        .status(500)
        .json({ error: 'An error occurred while removing device token.' });
    }
  }
}
