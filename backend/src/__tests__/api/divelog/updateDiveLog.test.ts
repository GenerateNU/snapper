import request from 'supertest';
import express from 'express';
import divelog from '../../../routes/divelog';
import { isAuthenticated } from '../../../middlewares/authMiddleware';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/users';
import { DiveLog } from '../../../models/diveLog';
import { config } from '../../../config/config';
import {
  invalidUpdateCasesDiveLog,
  validSingleFieldUpdate,
} from '../../../consts/testConstant';

jest.mock('../../../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    next();
  },
}));

const app = express();
const router = express.Router();

app.use(express.json());
app.use(isAuthenticated);
divelog(router);
app.use(router);

describe('PUT /divelog/:id', () => {
  let testUserId: mongoose.Types.ObjectId;
  let diveLogId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    try {
      await mongoose.connect(config.mongo.url);
      const user = await UserModel.create({
        email: 'testuser4@example.com',
        password: 'testpassword123',
        supabaseId: 'b4d5e6d7-760f-447a-9c59-6e1f14e8ceb3',
        username: 'testuser4',
      });
      testUserId = user._id;

      const diveLog = await DiveLog.create({
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
        description: 'Initial dive log',
      });
      diveLogId = diveLog._id;
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

  test('400 cannot changing field userId', async () => {
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
        fishTags: [],
        location: {
          type: 'Point',
          coordinates: [40.712776, -74.005974],
        },
        date: '2024-09-17T15:12:46Z',
        time: '15:30',
        duration: 60,
        depth: 30,
        image: ['https://example.com/tuna.jpg'],
        description: 'A great dive at the reef with lots of colorful fish.',
      };

      (payload as any)[field] = value;

      const response = await request(app)
        .put(`/divelog/${diveLogId}`)
        .send(payload);

      expect(response.status).toBe(400);
      const errorMessages = response.body.errors.map((error: any) => error.msg);
      expect(errorMessages).toContain(message);
    },
  );
});
