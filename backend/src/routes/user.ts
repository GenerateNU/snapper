import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getUserByID } from '../controllers/User/GetUserByID';
import { getUserDiveLogs } from '../controllers/User/GetMyDivelog';
import { getUserFish } from '../controllers/User/GetMyFish';
import { PutUser } from '../controllers/User/PutUser';
import { toggleUserFollow } from '../controllers/User/toggleUserFollow';
import { getUserMe } from '../controllers/User/GetUserMe';
import { getUserFishById } from '../controllers/User/GetUserFish';
import { getUserDiveLogsById } from '../controllers/User/GetUserDivelog';
import { toggleLikeDivelog } from '../controllers/User/toggleLikeDivelog';
import { getNotifications } from '../controllers/User/getNotification';
import { ExpoTokenController } from '../controllers/User/expoToken';

export default (router: express.Router) => {
  router.get('/user/me', isAuthenticated, getUserMe); // get the current user
  router.get('/user/:userid', isAuthenticated, getUserByID); // get a specific user based on supabaseId
  router.get('/user/items/fish', isAuthenticated, getUserFish);
  router.get('/user/items/divelogs', isAuthenticated, getUserDiveLogs);
  router.get('/user/:id/fish', isAuthenticated, getUserFishById); // supabaseId
  router.get('/user/:id/divelogs', isAuthenticated, getUserDiveLogsById); // supabaseId
  router.put('/user/actions/edit', isAuthenticated, PutUser); //user put route
  router.patch('/user/:id/follow/:userid', isAuthenticated, toggleUserFollow);
  router.patch('/user/:id/like/:divelogId', isAuthenticated, toggleLikeDivelog);
  router.get('/user/:id/notifications', isAuthenticated, getNotifications);
  router.post(
    '/user/:id/registerExpoToken',
    isAuthenticated,
    new ExpoTokenController().saveExpoToken,
  );
  router.post(
    '/user/:id/removeExpoToken',
    isAuthenticated,
    new ExpoTokenController().deleteExpoToken,
  );
};
