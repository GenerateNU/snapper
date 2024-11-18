const { body, param, check } = require('express-validator');

export const createDiveLogValidation = [
  body('user')
    .notEmpty()
    .withMessage('User is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('location').notEmpty().withMessage('Location is required'),
  body('location.type')
    .equals('Point')
    .withMessage('Location type must be "Point"'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of two numbers')
    .custom((coords: any[]) => {
      if (coords.length !== 2) {
        throw new Error('Coordinates must be an array of two numbers');
      }
      if (!coords.every((val) => typeof val === 'number' && !isNaN(val))) {
        throw new Error('Each coordinate must be a number');
      }
      return true;
    }),
  body('photos')
    .optional()
    .isArray()
    .withMessage('Photos must be an array of strings')
    .custom((photos: any[]) => {
      if (
        !photos.every(
          (val) =>
            typeof val === 'object' &&
            val !== null &&
            typeof val.base64 === 'string' &&
            typeof val.name === 'string' &&
            typeof val.fileType === 'string',
        )
      ) {
        throw new Error(
          'Each photo must be an object with keys "base64", "name", and "fileType", all with string values',
        );
      }
      return true;
    }),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

export const updateDiveLogValidation = [
  // @ts-ignore
  check('user').custom((_value, { req }) => {
    if (req.body.hasOwnProperty('user')) {
      throw new Error('User field cannot be updated');
    }
    return true;
  }),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('location.type')
    .optional()
    .equals('Point')
    .withMessage('Location type must be "Point"'),
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of two numbers')
    .custom((coords: any[]) => {
      if (coords.length !== 2) {
        throw new Error('Coordinates must be an array of two numbers');
      }
      if (!coords.every((val) => typeof val === 'number' && !isNaN(val))) {
        throw new Error('Each coordinate must be a number');
      }
      return true;
    }),
  body('time').optional().isString().withMessage('Time must be a string'),
  body('duration')
    .optional()
    .isNumeric()
    .withMessage('Duration must be a number'),
  body('depth').optional().isNumeric().withMessage('Depth must be a number'),
  body('photos')
    .optional()
    .isArray()
    .withMessage('Photos must be an array of strings')
    .custom((photos: any[]) => {
      if (!photos.every((val) => typeof val === 'string')) {
        throw new Error('Each photo URL must be a string');
      }
      return true;
    }),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

export const idFormatValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),
];
