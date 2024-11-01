import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getUserByID } from '../controllers/User/GetUserByID';
import { getUserDiveLogs } from '../controllers/User/GetMyDivelog';
import { getUserFish } from '../controllers/User/GetMyFish';
import { PutUser } from '../controllers/User/PutUser';
import { toggleUserFollow } from '../controllers/User/toggleUserFollow';
import { getUserMe } from '../controllers/User/GetUserMe';
import { getUserBadges } from '../controllers/User/GetMyBadges';
import { getUserFishById } from '../controllers/User/GetUserFish';
import { getUserDiveLogsById } from '../controllers/User/GetUserDivelog';

export default (router: express.Router) => {
  router.get('/user/me', isAuthenticated, getUserMe); // get the current user
  router.get('/user/:userid', isAuthenticated, getUserByID); // get a specific user based on supabaseId
  router.get('/user/items/fish', isAuthenticated, getUserFish);
  router.get('/user/items/badges', isAuthenticated, getUserBadges);
  router.get('/user/items/divelogs', isAuthenticated, getUserDiveLogs);
  router.get('/user/:id/fish', isAuthenticated, getUserFishById); // supabaseId
  router.get('/user/:id/divelogs', isAuthenticated, getUserDiveLogsById); // supabaseId
  router.put('/user/actions/edit', isAuthenticated, PutUser); //user put route
  router.patch(
    '/user/actions/follow/:userid',
    isAuthenticated,
    toggleUserFollow,
  );
};
