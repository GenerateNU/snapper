import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getById, getByScientificName, getSpeciesBySearch } from '../controllers/species/get';

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
 * /species/query:
 *   get:
 *     summary: Query species
 *     description: Search for species by a query string or retrieve top results alphabetically.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         description: Query string to search for species
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved species results
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export default (router: express.Router) => {
  router.get('/species/id/:id', isAuthenticated, getById);
  router.get(
    '/species/scientific/:scientificName',
    isAuthenticated,
    getByScientificName,
  );
    router.get('/species/query', isAuthenticated, getSpeciesBySearch);
};