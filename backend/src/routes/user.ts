import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { toggleUserFollow } from '../controllers/user/toggleUserFollow';
import { toggleLikeDivelog } from '../controllers/user/toggleLikeDivelog';
import { getNotifications } from '../controllers/user/getNotification';
import { ExpoTokenController } from '../controllers/user/expoToken';
import { getFollowingPosts } from '../controllers/user/getFollowingPosts';
import { getUserBySupabaseId } from '../controllers/user/getUserBySupabaseID';
import { getUserMe } from '../controllers/user/getUserMe';
import { getUserByMongoID } from '../controllers/user/getUserByMongoID';
import { getMySpecies } from '../controllers/user/getMySpecies';
import { getMyDiveLogs } from '../controllers/user/getMyDivelog';
import { getUserSpecies } from '../controllers/user/getUserSpecies';
import { getUserDiveLogs } from '../controllers/user/getUserDivelog';
import { putUser } from '../controllers/user/putUser';

export default (router: express.Router) => {
  // user-specific routes
  router.get('/user/me', isAuthenticated, getUserMe);
  router.get('/user/:id', isAuthenticated, getUserByMongoID); // mongoDB Id
  router.get('/user/:id/supabase', isAuthenticated, getUserBySupabaseId); // supabaseId

  // user items (ids are mongoDB ID)
  router.get('/user/items/species', isAuthenticated, getMySpecies);
  router.get('/user/items/divelogs', isAuthenticated, getMyDiveLogs);
  router.get('/user/:id/species', isAuthenticated, getUserSpecies);
  router.get('/user/:id/divelogs', isAuthenticated, getUserDiveLogs);

  // user actions (ids are mongoDB ID)
  router.put('/user/actions/edit', isAuthenticated, putUser);
  router.patch('/user/:id/follow/:userId', isAuthenticated, toggleUserFollow);
  router.patch('/user/:id/like/:divelogId', isAuthenticated, toggleLikeDivelog);

  // Notifications and posts (ids are mongoDB ID)
  router.get('/user/:id/notifications', isAuthenticated, getNotifications);
  router.get('/user/:id/followingPosts', isAuthenticated, getFollowingPosts);

  // expo device token (ids are mongoDB ID)
  router.post('/user/:id/expoDeviceToken', isAuthenticated, ExpoTokenController.handleExpoToken);
};
