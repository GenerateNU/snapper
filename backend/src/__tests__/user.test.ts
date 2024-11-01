import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';
import express from 'express';
import request from 'supertest';
import userRoute from '../routes/user';
import { UserModel } from '../models/users';
import { Fish } from '../models/fish';
import { DiveLog } from '../models/diveLog';

// Mock the authMiddleware
jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
    // Mock session object with required properties
    req.session = {
      userId: '9f824f26-59b7-4f7f-a1b4-fef456b69bdf', // Example user ID
      id: 'mock-session-id', // Mock session ID
      cookie: {
        originalMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiration date
        secure: false, // Set to true in production
        httpOnly: true, // Prevent client-side access
        path: '/', // Cookie path
      },
      regenerate: jest.fn((cb) => cb(null)), // Mock regenerate method
      destroy: jest.fn((cb) => cb(null)), // Mock destroy method
      reload: jest.fn((cb) => cb(null)), // Mock reload method
      save: jest.fn((cb) => cb(null)), // Mock save method
      resetMaxAge: jest.fn(), // Mock resetMaxAge method
      touch: jest.fn(), // Mock touch method
    } as unknown as Session; // Cast to unknown and then to Session

    return next();
  },
}));

jest.mock('../models/users');
jest.mock('../models/fish');
jest.mock('../models/diveLog');

const mockUserModelFindOne = jest.fn();
const mockFishFind = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue([]),
});
const mockDiveLogFind = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue([]),
});

UserModel.findOne = mockUserModelFindOne;
Fish.find = mockFishFind;
DiveLog.find = mockDiveLogFind;

const app = express();
const router = express.Router();
userRoute(router);
app.use(router);

describe('User Routes', () => {
  describe('GET /user/:id', () => {
    it('Gets a specific user from id', async () => {
      const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
      const user = {
        diveLogs: [],
        fishCollected: [],
        followers: [],
        following: [],
        _id: '66e357c93572d39e66a0ba31',
        username: 'zainab_i',
        email: 'zainab.imadulla@icloud.com',
        supabaseId: id,
        __v: 0,
      };

      mockUserModelFindOne.mockResolvedValue(user); // Mock resolved value for user find
      const res = await request(app).get(`/user/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        user: {
          diveLogs: [],
          fishCollected: [],
          followers: [],
          following: [],
          _id: '66e357c93572d39e66a0ba31',
          username: 'zainab_i',
          email: 'zainab.imadulla@icloud.com',
          supabaseId: id,
          __v: 0,
        },
        message: `Successfully found the user ID:${id}`,
      });
    });

    it('Returns 400 if user is not found', async () => {
      const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
      mockUserModelFindOne.mockResolvedValue(null); // Simulate user not found
      const res = await request(app).get(`/user/${id}`);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Unable to find user of ID: ' + id });
    });
  });

  describe('GET /user/items/fish', () => {
    it('Gets specific fish for user', async () => {
      const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
      const user = {
        _id: id,
        fishCollected: [],
      };

      mockUserModelFindOne.mockResolvedValue(user);
      const res = await request(app).get(`/user/items/fish`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        fish: [],
        message: `Successfully found fish for user:${id}`,
      });
    });
  });

  describe('GET /user/items/divelogs', () => {
    it('Gets specific dive logs for user', async () => {
      const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
      const user = {
        _id: id,
        diveLogs: [],
      };

      mockUserModelFindOne.mockResolvedValue(user);
      const res = await request(app).get(`/user/items/divelogs`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        divelogs: [],
        message: `Successfully found dive logs for user:${id}`,
      });
    });
  });

  describe('PUT /user/actions/edit', () => {
    it('edits user', async () => {
      const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
      const updatedUser = {
        username: 'zainabimadulla',
      };
      const user = {
        ...updatedUser,
        _id: id,
      };

      mockUserModelFindOne.mockResolvedValue(user);
      const res = await request(app)
        .put(`/user/actions/edit`)
        .send(updatedUser);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: `Successfully updated user:${id}`,
      });
    });
  });
});
