jest.mock('../../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    next();
  },
}));

const mockExec = jest.fn();
const mockFindByIdAndDelete = jest.fn(() => ({ exec: mockExec }));

jest.mock('../../models/diveLog', () => ({
  DiveLog: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findByIdAndDelete: mockFindByIdAndDelete,
  },
}));

import express from 'express';
import request from 'supertest';
import divelog from '../../routes/divelog';
import { isAuthenticated } from '../../middlewares/authMiddleware';
import mongoose from 'mongoose';
import { invalidIdCases } from '../../consts/testConstant';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(isAuthenticated);
divelog(router);
app.use(router);

describe('DELETE /divelog/:id', () => {
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

  it('should return 200 for valid diveLogId and successful deletion', async () => {
    mockExec.mockResolvedValue(payload);

    const response = await request(app).delete(`/divelog/${diveLogId}`);

    expect(response.status).toBe(200);
    expect(mockFindByIdAndDelete).toHaveBeenCalledWith(diveLogId.toString());
    expect(mockExec).toHaveBeenCalled();
  });

  it.each(invalidIdCases)(
    'should return 400 for invalid diveLogId: %s',
    async (invalidId) => {
      const response = await request(app).delete(`/divelog/${invalidId}`);

      expect(response.status).toBe(400);
      expect(mockFindByIdAndDelete).not.toHaveBeenCalled();
    },
  );

  it('should return 404 when dive log is not found', async () => {
    mockExec.mockResolvedValue(null);

    const response = await request(app).delete(`/divelog/${diveLogId}`);

    expect(response.status).toBe(404);
    expect(mockFindByIdAndDelete).toHaveBeenCalledWith(diveLogId.toString());
    expect(mockExec).toHaveBeenCalled();
  });
});
