jest.mock('../../../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    next();
  },
}));

import request from 'supertest';
import express from 'express';
import divelog from '../../../routes/divelog';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/users';
import {
  invalidCasesDiveLog,
  missingFieldCasesDiveLog,
} from '../../../consts/testConstant';
import { DiveLog } from '../../../models/diveLog';

const app = express();
const router = express.Router();

app.use(express.json());
divelog(router);
app.use(router);

describe('POST /divelog', () => {
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(() => {
    testUserId = new mongoose.Types.ObjectId();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    UserModel.create = jest.fn().mockResolvedValue({
      _id: testUserId,
      email: 'testuser1@example.com',
      password: 'testpassword123',
      supabaseId: 'e49be72b-ab52-48d8-b7c4-7f4242dd6e92',
      username: 'testuser1',
    });

    UserModel.findById = jest.fn().mockResolvedValue({
      _id: testUserId,
      email: 'testuser1@example.com',
      password: 'testpassword123',
      supabaseId: 'e49be72b-ab52-48d8-b7c4-7f4242dd6e92',
      username: 'testuser1',
    });
  });

  it('201 with authentication and valid JSON payload', async () => {
    const payload = {
      user: testUserId,
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

    const mockDiveLog = {
      _id: new mongoose.Types.ObjectId(),
      ...payload,
    };

    DiveLog.create = jest.fn().mockResolvedValue(mockDiveLog);

    const response = await request(app).post('/divelog').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toEqual(mockDiveLog._id.toString());
    expect(response.body.user).toBe(testUserId.toString());
    expect(response.body.location).toEqual(payload.location);
    expect(response.body.date).toBe(payload.date);
    expect(response.body.time).toBe(payload.time);
    expect(response.body.duration).toBe(payload.duration);
    expect(response.body.depth).toBe(payload.depth);
    expect(response.body.photos).toEqual(payload.photos);
    expect(response.body.description).toBe(payload.description);
  });

  it.each(invalidCasesDiveLog)(
    '400 for invalid %s',
    async ({ field, value, message }) => {
      const payload = {
        user: testUserId,
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
      const response = await request(app).post('/divelog').send(payload);
      expect(response.status).toBe(400);
      const errorMessages = response.body.errors.map((error: any) => error.msg);
      expect(errorMessages).toContain(message);
    },
  );

  it.each(missingFieldCasesDiveLog)(
    '400 for missing required %s',
    async ({ field, value, message }) => {
      const payload = {
        user: testUserId,
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
      const response = await request(app).post('/divelog').send(payload);
      expect(response.status).toBe(400);
      const errorMessages = response.body.errors.map((error: any) => error.msg);
      expect(errorMessages).toContain(message);
    },
  );

  it('404 user not found', async () => {
    const payload = {
      user: new mongoose.Types.ObjectId(),
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

    UserModel.findById = jest.fn().mockResolvedValue(null);
    const response = await request(app).post('/divelog').send(payload);
    expect(response.status).toBe(404);
  });
});
