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
import { isAuthenticated } from '../../../middlewares/authMiddleware';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/users';
import { DiveLog } from '../../../models/diveLog';
import { config } from '../../../config/config';
import {
  invalidCasesDiveLog,
  missingFieldCasesDiveLog,
} from '../../../consts/testConstant';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(isAuthenticated);
divelog(router);
app.use(router);

describe('POST /divelog', () => {
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      await mongoose.connect(config.mongo.url);
      const user = await UserModel.create({
        email: 'testuser1@example.com',
        password: 'testpassword123',
        supabaseId: 'e49be72b-ab52-48d8-b7c4-7f4242dd6e92',
        username: 'testuser1',
      });
      testUserId = user._id;
    } catch (error) {
      console.error(
        'Error connecting to MongoDB or creating test user:',
        error,
      );
    }
  });

  afterAll(async () => {
    await DiveLog.deleteMany({ user: testUserId });
    await UserModel.deleteOne({ _id: testUserId });
    await mongoose.connection.close();
  });

  test('201 with authentication and valid JSON payload', async () => {
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

    const response = await request(app).post('/divelog').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.user).toBe(testUserId.toString());
    expect(response.body.location).toEqual(payload.location);

    const normalizedResponseDate =
      new Date(response.body.date).toISOString().slice(0, -5) + 'Z';
    expect(normalizedResponseDate).toBe(payload.date);

    expect(response.body.time).toBe(payload.time);
    expect(response.body.duration).toBe(payload.duration);
    expect(response.body.depth).toBe(payload.depth);
    expect(response.body.photos).toEqual(payload.photos);
    expect(response.body.description).toBe(payload.description);
  });

  test.each(invalidCasesDiveLog)(
    '400 for invalid %s',
    async ({ field, value, message }) => {
      const payload = {
        user: testUserId,
        fishTags: [],
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

  test.each(missingFieldCasesDiveLog)(
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

  test('404 user not found', async () => {
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

    const response = await request(app).post('/divelog').send(payload);

    expect(response.status).toBe(404);
  });
});
