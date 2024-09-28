import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';

/**
 * @swagger
 * /ping:
 *   get:
 *     description: Health Check
 *     responses:
 *       200:
 *         description: Authentification Health Check
 *       401:
 *         description: Unauthorized Health Check
 */
export default (router: express.Router) => {
  router.get('/ping', isAuthenticated, (_req, res) => {
    res.status(200).json({ hello: 'world' });
  });
};
