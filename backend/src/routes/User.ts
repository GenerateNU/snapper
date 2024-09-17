import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getUserByID } from '../controllers/User/GetUserByID';

export default (router: express.Router) => {
  router.get('/user/:userid', isAuthenticated, getUserByID);
};
