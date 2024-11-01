import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getById } from '../controllers/fish/get';
import { createFish } from '../controllers/fish/create';

/**
 * @swagger
 * /fish/{id}:
 *   get:
 *     summary: Get fish by ID
 *     description: Retrieve a fish by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the fish to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved fish
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fish not found
 */
export default (router: express.Router) => {
  router.get('/fish/:id', isAuthenticated, getById);
  router.post('/fish', isAuthenticated, createFish); // for manual testing purpose
};
