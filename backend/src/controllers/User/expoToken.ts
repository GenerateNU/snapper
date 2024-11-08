import express from 'express';
import { findUserBySupabaseId } from '../../services/userService';
import { UserService, UserServiceImpl } from '../../services/userService';
import { Expo } from 'expo-server-sdk';

const userService: UserService = new UserServiceImpl();

export const ExpoTokenController = {
  async handleExpoToken(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> {
    try {
      const { id: userId } = req.params;
      const { token } = req.body;

      if (!userId) return res.status(400).json({ error: 'User ID is required' });
      if (!token) return res.status(400).json({ error: 'Expo push token is required' });

      const user = await findUserBySupabaseId(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!Expo.isExpoPushToken(token)) {
        return res.status(400).json({ error: 'Invalid Expo push token' });
      }

      const userMongoId = user._id.toString();
      const tokenExists = await userService.tokenAlreadyExists(userMongoId, token);

      const responseMessage = tokenExists
        ? await removeToken(userMongoId, token)
        : await saveToken(userMongoId, token);

      return res.status(200).json({ message: responseMessage });
    } catch (error) {
      console.error('Error handling Expo token:', error);
      return res.status(500).json({ error: 'An error occurred while processing Expo token.' });
    }
  },
};

async function removeToken(userMongoId: string, token: string): Promise<string> {
  await userService.removeExpoToken(userMongoId, token);
  return 'Device token removed successfully';
}

async function saveToken(userMongoId: string, token: string): Promise<string> {
  await userService.saveExpoToken(userMongoId, token);
  return 'Device token stored successfully';
}
