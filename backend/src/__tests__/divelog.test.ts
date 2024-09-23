import request from 'supertest';
import express from 'express';
import diveLogRoute from '../routes/divelog';
import { DiveLog } from '../models/diveLog';

jest.mock('../models/diveLog');

DiveLog.aggregate = jest.fn();

jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return next();
  },
}));

const app = express();
const router = express.Router();

diveLogRoute(router);
app.use(router);

describe('GET /divelogs', () => {
  beforeEach(() => {
    (DiveLog.aggregate as jest.Mock).mockReset();
  });

  it('should return 200 with dive logs', async () => {
    const mockDiveLogs = [
      { id: 1, location: 'Dive Site 1' },
      { id: 2, location: 'Dive Site 2' },
    ];

    (DiveLog.aggregate as jest.Mock).mockResolvedValue(mockDiveLogs);

    const res = await request(app).get(
      '/divelogs?lat=37.7749&lng=-122.4194&page=1&limit=10',
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDiveLogs);
  });

  it('should return 400 if latitude or longitude is missing', async () => {
    const res = await request(app).get('/divelogs?page=1&limit=10');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Latitude and longitude are required',
    });
  });

  it('should handle pagination correctly', async () => {
    const allDiveLogs = [
      { id: 1, location: 'Dive Site 1' },
      { id: 2, location: 'Dive Site 2' },
      { id: 3, location: 'Dive Site 3' },
      { id: 4, location: 'Dive Site 4' },
    ];

    (DiveLog.aggregate as jest.Mock).mockImplementation(async () => {
      return allDiveLogs.slice(2, 4); // Return items for page 2 limit 2
    });

    const res = await request(app).get(
      '/divelogs?lat=37.7749&lng=-122.4194&page=2&limit=2',
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 3, location: 'Dive Site 3' },
      { id: 4, location: 'Dive Site 4' },
    ]);
  });

  it('should return 500 if there is an error fetching dive logs', async () => {
    (DiveLog.aggregate as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    const res = await request(app).get(
      '/divelogs?lat=37.7749&lng=-122.4194&page=1&limit=10',
    );

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Error fetching dive logs',
      error: expect.any(Object),
    });
  });
});
