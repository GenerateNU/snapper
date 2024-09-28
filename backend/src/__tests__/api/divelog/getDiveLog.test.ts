jest.mock('../../../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    next();
  },
}));

const mockExec = jest.fn();
const mockFindById = jest.fn(() => ({ exec: mockExec }));

jest.mock('../../../models/diveLog', () => ({
  DiveLog: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findById: mockFindById,
  },
}));

import request from 'supertest';
import express from 'express';
import divelog from '../../../routes/divelog';
import { isAuthenticated } from '../../../middlewares/authMiddleware';
import mongoose from 'mongoose';
import { invalidIdCases } from '../../../consts/testConstant';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(isAuthenticated);
divelog(router);
app.use(router);

describe('GET /divelog/:id', () => {
  const testUserId = new mongoose.Types.ObjectId();
  const diveLogId = new mongoose.Types.ObjectId();
  const payload = {
    user: testUserId.toString(),
    location: 'Great Barrier Reef',
    date: new Date().toISOString(),
    time: '10:00',
    duration: 30,
    depth: 18,
    photos: ['photo1.jpg', 'photo2.jpg'],
    description: 'Fun dive!',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('200 with authentication and valid diveLogId', async () => {
    mockExec.mockResolvedValue({
      ...payload,
      _id: diveLogId,
    });

    const response = await request(app).get(`/divelog/${diveLogId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.user).toBe(testUserId.toString());
    expect(response.body.location).toEqual(payload.location);

    const normalizedResponseDate =
      new Date(response.body.date).toISOString().slice(0, -5) + 'Z';
    const normalizedPayloadDate =
      new Date(payload.date).toISOString().slice(0, -5) + 'Z';

    expect(normalizedResponseDate).toBe(normalizedPayloadDate);

    expect(response.body.time).toBe(payload.time);
    expect(response.body.duration).toBe(payload.duration);
    expect(response.body.depth).toBe(payload.depth);
    expect(response.body.photos).toEqual(payload.photos);
    expect(response.body.description).toBe(payload.description);
  });

  it('404 diveLog not found', async () => {
    mockExec.mockResolvedValue(null);

    const testId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/divelog/${testId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Dive log not found');
  });

  it.each(invalidIdCases)(
    'should return %s and status %i',
    async (_, invalidId, expectedStatus) => {
      mockExec.mockResolvedValue(null);
      const response = await request(app).get(`/divelog/${invalidId}`);
      expect(response.status).toBe(expectedStatus);
    },
  );
});
