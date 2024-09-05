import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';

export default (router: express.Router) => {
  router.get('/ping', isAuthenticated, (_req, res) => {
    res.status(200).json({ hello: 'world' });
  });
};
