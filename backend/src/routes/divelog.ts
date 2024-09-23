import { isAuthenticated } from './../middlewares/authMiddleware';
import express from 'express';
import {
  createDiveLogValidation,
  idFormatValidation,
  updateDiveLogValidation,
} from '../validators/divelog';
import { DiveLogController } from '../controllers/divelog';

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
};
