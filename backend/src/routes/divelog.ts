import { isAuthenticated } from './../middlewares/authMiddleware';
import {
  getAllDiveLogsSortedPaginated,
  searchDivelogsPaginated,
} from '../controllers/divelogs/get';

import express from 'express';
import {
  createDiveLogValidation,
  idFormatValidation,
  updateDiveLogValidation,
} from '../validators/divelog';
import { DiveLogController } from '../controllers/divelogs/divelog';

/**
 * @swagger
 * /divelog:
 *   post:
 *     summary: Create a new dive log
 *     description: Creates a new dive log entry for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID of the user creating the dive log
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ['Point']
 *                     description: Type of the location
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordinates of the dive location
 *               time:
 *                 type: string
 *                 description: Time of the dive
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the dive in ISO 8601 format
 *               depth:
 *                 type: number
 *                 description: Depth of the dive
 *               duration:
 *                 type: number
 *                 description: Duration of the dive
 *               speciesTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of IDs referencing species tags
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of url referencing AWS S3 photos
 *               description:
 *                 type: string
 *                 description: Caption of the dive log
 *             required:
 *               - user
 *               - location
 *               - date
 *     responses:
 *       201:
 *         description: Successfully created dive log
 *       400:
 *         description: Bad request - validation errors
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 * /divelog/{id}:
 *   get:
 *     summary: Retrieve a dive log by ID
 *     description: Gets the details of a dive log using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the dive log to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved dive log
 *       400:
 *         description: Bad request - invalid ID format
 *       404:
 *         description: Dive log not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a dive log by ID
 *     description: Updates an existing dive log entry using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the dive log to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: ['Point']
 *                     description: Type of the location
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordinates of the dive location
 *               time:
 *                 type: string
 *                 description: Time of the dive
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the dive in ISO 8601 format (YYYY-MM-DD)
 *               depth:
 *                 type: number
 *                 description: Depth of the dive
 *               duration:
 *                 type: number
 *                 description: Duration of the dive
 *               speciesTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of IDs referencing species tags
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: AWS S3 url of photos
 *               description:
 *                 type: string
 *                 description: Caption of the dive log
 *     responses:
 *       200:
 *         description: Successfully updated dive log
 *       400:
 *         description: Bad request - validation errors
 *       404:
 *         description: Dive log not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a dive log by ID
 *     description: Deletes a dive log entry using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the dive log to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted dive log
 *       404:
 *         description: Dive log not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /divelogs:
 *   get:
 *     summary: Retrieve all dive logs sorted and paginated
 *     description: Fetches all dive logs sorted by proximity to the given geographical coordinates (latitude and longitude) with pagination support.
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         description: Latitude of the location to search dive logs near
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         description: Longitude of the location to search dive logs near
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination (defaults to 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of dive logs to return per page (defaults to 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved dive logs
 *       400:
 *         description: Bad request - missing latitude or longitude
 *       500:
 *         description: Internal server error - error fetching dive logs
 */
export default (router: express.Router) => {
  router.post(
    '/divelog',
    isAuthenticated,
    createDiveLogValidation,
    DiveLogController.createDiveLog,
  );
  router.get(
    '/divelog/:id',
    isAuthenticated,
    idFormatValidation,
    DiveLogController.getDiveLogById,
  );
  router.put(
    '/divelog/:id',
    isAuthenticated,
    updateDiveLogValidation,
    DiveLogController.updateDiveLog,
  );
  router.delete(
    '/divelog/:id',
    isAuthenticated,
    idFormatValidation,
    DiveLogController.deleteDiveLog,
  );
  router.get('/divelogs', isAuthenticated, getAllDiveLogsSortedPaginated);
  router.get('/divelogs/search', isAuthenticated, searchDivelogsPaginated);
};
