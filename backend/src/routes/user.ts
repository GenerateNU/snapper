import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getUserByID } from '../controllers/User/GetUserByID';
import { getUserDiveLogs } from '../controllers/User/GetUserDivelog';
import { getUserFish } from '../controllers/User/GetUserFish';
import { PutUser } from '../controllers/User/PutUser';

export default (router: express.Router) => {
  router.get('/user/:userid', isAuthenticated, getUserByID);
  router.get('/user/items/fish', isAuthenticated, getUserFish);
  router.get('/user/items/divelogs', isAuthenticated, getUserDiveLogs);
  router.put('/user/actions/edit', isAuthenticated, PutUser); //user put route
};
