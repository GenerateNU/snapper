import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getUserByMongoID } from '../controllers/User/GetUserByMongoID';
import { getUserSpecies } from '../controllers/User/GetMySpecies';
import { PutUser } from '../controllers/User/PutUser';
import { toggleUserFollow } from '../controllers/User/toggleUserFollow';
import { getUserMe } from '../controllers/User/GetUserMe';
import { getUserSpeciesById } from '../controllers/User/GetUserFish';
import { getUserDiveLogsById } from '../controllers/User/GetUserDivelog';
import { toggleLikeDivelog } from '../controllers/User/toggleLikeDivelog';
import { getNotifications } from '../controllers/User/getNotification';
import { ExpoTokenController } from '../controllers/User/expoToken';
import { getUserDiveLogs } from '../controllers/User/GetMyDivelog';
import { getFollowingPosts } from '../controllers/User/getFollowingPosts';
import { getUserBySupabaseId } from '../controllers/User/getUserBySupabaseID';

export default (router: express.Router) => {
  router.get('/user/me', isAuthenticated, getUserMe); // get the current user
  router.get('/user/:userid', isAuthenticated, getUserByMongoID);
  router.get('/user/:userid/supabase', isAuthenticated, getUserBySupabaseId);
  router.get('/user/items/species', isAuthenticated, getUserSpecies);
  router.get('/user/me', isAuthenticated, getUserMe); // get the current user
  router.get('/user/items/species', isAuthenticated, getUserSpecies);
  router.get('/user/items/divelogs', isAuthenticated, getUserDiveLogs);
  router.get('/user/:id/species', isAuthenticated, getUserSpeciesById); 
  router.get('/user/:id/divelogs', isAuthenticated, getUserDiveLogsById); 
  router.put('/user/actions/edit', isAuthenticated, PutUser); //user put route
  router.patch('/user/:id/follow/:userid', isAuthenticated, toggleUserFollow);
  router.patch('/user/:id/like/:divelogId', isAuthenticated, toggleLikeDivelog);
  router.get('/user/:id/notifications', isAuthenticated, getNotifications);
  router.post(
    '/user/:id/expoDeviceToken',
    isAuthenticated,
    ExpoTokenController.handleExpoToken,
  );
  router.get('/user/:id/followingPosts', isAuthenticated, getFollowingPosts);
};
