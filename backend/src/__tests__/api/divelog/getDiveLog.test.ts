import request from 'supertest';
import express from 'express';
import divelog from '../../../routes/divelog';
import { isAuthenticated } from '../../../middlewares/authMiddleware';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/users';
import { DiveLog } from '../../../models/diveLog';
import { config } from '../../../config/config';

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

describe('GET /divelog/:id', () => {
  let testUserId: mongoose.Types.ObjectId;
  let diveLogId: mongoose.Types.ObjectId;
  let payload: any;

  beforeAll(async () => {
    try {
      await mongoose.connect(config.mongo.url);
      const user = await UserModel.create({
        email: 'testuser3@example.com',
        password: 'testpassword123',
        supabaseId: '7a9bf692-2b81-464a-8415-01024eab39e0',
        username: 'testuser3',
      });
      testUserId = user._id;

      payload = {
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
      };
      const diveLog = await DiveLog.create(payload);
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

  test('200 with authentication and valid diveLogId', async () => {
    const response = await request(app).get(`/divelog/${diveLogId}`);

    expect(response.status).toBe(200);
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

  test('400 invalid diveLogId', async () => {
    const invalidId = '1';
    const response = await request(app).get(`/divelog/${invalidId}`);
    expect(response.status).toBe(400);
  });

  test('404 diveLog not found', async () => {
    const testId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/divelog/${testId}`);
    expect(response.status).toBe(404);
  });
});
