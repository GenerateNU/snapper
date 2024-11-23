jest.mock('../../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    next();
  },
}));

const mockUpdate = jest.fn();
const mockFindById = jest.fn(() => ({
  exec: jest.fn(),
}));

jest.mock('../../models/diveLog', () => ({
  DiveLog: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findById: mockFindById,
    findByIdAndUpdate: mockUpdate,
  },
}));

import { isAuthenticated } from '../../middlewares/authMiddleware';
import request from 'supertest';
import express from 'express';
import divelog from '../../routes/divelog';
import mongoose from 'mongoose';
import {
  invalidUpdateCasesDiveLog,
  validSingleFieldUpdate,
} from '../../consts/testConstant';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(isAuthenticated);
divelog(router);
app.use(router);

describe('PUT /divelog/:id', () => {
  const diveLogId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('400 cannot change field userId', async () => {
    const testId = new mongoose.Types.ObjectId();
    const payload = {
      user: testId,
    };

    const response = await request(app)
      .put(`/divelog/${diveLogId}`)
      .send(payload);

    expect(response.status).toBe(400);
    const errorMessages = response.body.errors.map((error: any) => error.msg);
    expect(errorMessages).toContain('User field cannot be updated');
  });

  test.each(validSingleFieldUpdate)(
    '200 with authentication and valid JSON payload',
    async ({ field, value }) => {
      const payload = {
        location: {
          type: 'Point',
          coordinates: [40.712776, -74.005974],
        },
        date: '2024-09-17T15:12:46Z',
        time: '15:30',
        duration: 60,
        depth: 30,
        photos: [
          'https://example.com/salmon.jpg',
          'https://example.com/tuna.jpg',
        ],
        description: 'A great dive at the reef with lots of colorful fish.',
      };

      (payload as any)[field] = value;

      mockFindById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ _id: diveLogId }),
      });
      mockUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ ...payload, _id: diveLogId }),
      });

      const response = await request(app)
        .put(`/divelog/${diveLogId}`)
        .send(payload);

      expect(response.status).toBe(200);
      if (field === 'date') {
        const normalizedResponseDate =
          new Date(response.body.date).toISOString().slice(0, -5) + 'Z';
        expect(normalizedResponseDate).toBe(value);
      } else {
        expect(response.body[field]).toEqual(value);
      }
    },
  );

  test.each(invalidUpdateCasesDiveLog)(
    '400 for invalid update of %s',
    async ({ field, value, message }) => {
      const payload = {
        location: {
          type: 'Point',
          coordinates: [40.712776, -74.005974],
        },
        date: '2024-09-17T15:12:46Z',
        time: '15:30',
        duration: 60,
        depth: 30,
        photos: [
          'https://example.com/salmon.jpg',
          'https://example.com/tuna.jpg',
        ],
        description: 'A great dive at the reef with lots of colorful fish.',
      };

      (payload as any)[field] = value;

      mockFindById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ _id: diveLogId }),
      });

      const response = await request(app)
        .put(`/divelog/${diveLogId}`)
        .send(payload);

      expect(response.status).toBe(400);
      const errorMessages = response.body.errors.map((error: any) => error.msg);
      expect(errorMessages).toContain(message);
    },
  );
});
