import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getById } from '../controllers/species/getById';
import { getByScientificName } from '../controllers/species/getByScientificName';

/**
 * @swagger
 * /species/{id}:
 *   get:
 *     summary: Get species by ID
 *     description: Retrieve a species by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the species to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved species
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: species not found
 * /species/{scientificName}:
 *   get:
 *     summary: Get species by scientificName
 *     description: Retrieve a species by its unique scientificName.
 *     parameters:
 *       - in: path
 *         name: scientificName
 *         required: true
 *         description: scientificName of the species to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved species
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: species not found
 */
export default (router: express.Router) => {
    router.get('/species/:id', isAuthenticated, getById);
    router.get('/species/:scientificName', isAuthenticated, getByScientificName);
};
