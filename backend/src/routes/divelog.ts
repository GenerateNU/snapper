import express from 'express';
import { getAllDiveLogsSortedPaginated } from '../controllers/divelogs/get';
import { isAuthenticated } from '../middlewares/authMiddleware';

export default (router: express.Router) => {
  router.get('/divelogs', getAllDiveLogsSortedPaginated, isAuthenticated);
};
