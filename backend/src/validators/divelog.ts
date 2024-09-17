const { body, param } = require('express-validator');

export const createDiveLogValidation = [
    body('user').notEmpty().withMessage('User is required').isMongoId(),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('Coordinates must be an array of two numbers')
        .custom((coords: any[]) => {
            if (coords.length !== 2) {
                throw new Error('Coordinates must be an array of two numbers');
            }
            if (!coords.every(val => typeof val === 'number' && !isNaN(val))) {
                throw new Error('Each coordinate must be a number');
            }
            return true;
        })
];

export const updateDiveLogValidation = [
    body('user').optional().isMongoId().withMessage('Invalid user ID'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('location.coordinates')
        .optional()
        .isArray({ min: 2, max: 2 })
        .withMessage('Coordinates must be an array of two numbers')
        .custom((coords: any[]) => {
            if (coords.length !== 2) {
                throw new Error('Coordinates must be an array of two numbers');
            }
            if (!coords.every(val => typeof val === 'number' && !isNaN(val))) {
                throw new Error('Each coordinate must be a number');
            }
            return true;
        })
];

export const idFormatValidation = [
    param('id').notEmpty().withMessage('ID is required').isMongoId().withMessage('Invalid ID format')
];
