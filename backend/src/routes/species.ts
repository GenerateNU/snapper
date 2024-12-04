import express from 'express';
import {
  getById,
  getByScientificName,
  searchAndPaginatedSpecies,
  searchSpecies,
} from '../controllers/species/get';
import { isAuthenticated } from '../middlewares/authMiddleware';

/**
 * @swagger
 * /species/id/{id}:
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
 * /species/scientifc/{scientificName}:
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
  router.get('/species/id/:id', isAuthenticated, getById);
  router.get(
    '/species/scientific/:scientificName',
    isAuthenticated,
    getByScientificName,
  );
  router.get('/species/search/:searchRequest', isAuthenticated, searchSpecies);
  router.get('/species/paginated', isAuthenticated, searchAndPaginatedSpecies);
};
