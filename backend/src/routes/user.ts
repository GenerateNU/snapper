import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getUserByID } from '../controllers/User/GetUserByID';
import { getUserDiveLogs } from '../controllers/User/GetUserDivelog';
import { getUserFish } from '../controllers/User/GetUserFish';
import { PutUser } from '../controllers/User/PutUser';
import { toggleUserFollow } from '../controllers/User/toggleUserFollow';
import { getUserMe } from '../controllers/User/GetUserMe';
import { getUserBadges } from '../controllers/User/GetUserBadges';

export default (router: express.Router) => {
  router.get('/user/me', isAuthenticated, getUserMe); // get the current user
  router.get('/user/:userid', isAuthenticated, getUserByID); // get a specific user based on supabaseId
  router.get('/user/items/fish', isAuthenticated, getUserFish);
  router.get('/user/items/badges', isAuthenticated, getUserBadges);
  router.get('/user/items/divelogs', isAuthenticated, getUserDiveLogs);
  router.put('/user/actions/edit', isAuthenticated, PutUser); //user put route
  router.patch(
    '/user/actions/follow/:userid',
    isAuthenticated,
    toggleUserFollow,
  );
};
