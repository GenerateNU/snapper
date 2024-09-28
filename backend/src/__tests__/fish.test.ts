jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return next();
  },
}));
import { Fish } from '../models/fish';
import request from 'supertest';
import express from 'express';
import fish from '../routes/fish';
import mongoose from 'mongoose';

jest.mock('../models/fish');

const app = express();
const router = express.Router();
fish(router);

app.use(router);
const fishMock = Fish.findById as jest.Mock;

describe('GET /Fish', () => {
  beforeEach(() => {
    fishMock.mockReset();
  });

  it('No fish with this id', async () => {
    const randomObjectId = new mongoose.Types.ObjectId().toString();
    const query = `/fish/${randomObjectId}`;
    const res = await request(app).get(query);
    expect(res.status).toBe(404);
  });

  it('Gets a specific fish id', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const fish = { _id: id, commonName: 'Stonefish' };
    fishMock.mockResolvedValue(fish);
    const res = await request(app).get(`/fish/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(fish);
  });
});
