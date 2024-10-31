import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';

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

import express from 'express';
import { UserModel } from '../models/users';
import request from 'supertest';
import userRoute from '../routes/user';
jest.mock('../models/users');

UserModel.findOne = jest.fn();

const app = express();
const router = express.Router();
userRoute(router);

app.use(router);
const userMock = UserModel.findOne as jest.Mock;

describe('GET /user/:id', () => {
  beforeEach(() => {
    userMock.mockReset();
  });

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
      supabaseId: '9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
      __v: 0,
    };

    userMock.mockResolvedValue(user);
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
        supabaseId: '9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
        __v: 0,
      },
      message:
        'Successfully found the user ID:9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
    });
  });
});

describe('GET /user/items/fish', () => {
  beforeEach(() => {
    userMock.mockReset();
  });

  it('Gets specific fish by id', async () => {
    const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
    const user = {
      diveLogs: [],
      fishCollected: [],
      followers: [],
      following: [],
      _id: '66e357c93572d39e66a0ba31',
      username: 'zainab_i',
      email: 'zainab.imadulla@icloud.com',
      supabaseId: '9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
      __v: 0,
    };

    userMock.mockResolvedValue(user);
    const res = await request(app).get(`/user/items/fish`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      fish: [],
      message:
        'Successfully found fish for user:9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
    });
  });
});

describe('GET /user/items/divelogs', () => {
  beforeEach(() => {
    userMock.mockReset();
  });

  it('Gets specific divelogs by id', async () => {
    const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
    const user = {
      diveLogs: [],
      fishCollected: [],
      followers: [],
      following: [],
      _id: '66e357c93572d39e66a0ba31',
      username: 'zainab_i',
      email: 'zainab.imadulla@icloud.com',
      supabaseId: '9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
      __v: 0,
    };

    userMock.mockResolvedValue(user);
    const res = await request(app).get(`/user/items/divelogs`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      divelogs: [],
      message:
        'Successfully found dive logs for user:9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
    });
  });
});

describe('PUT /user/actions/edit', () => {
  beforeEach(() => {
    userMock.mockReset();
  });

  it('edits user', async () => {
    const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
    const updatedUser = {
      username: 'zainabimadulla',
    };
    const user = {
      diveLogs: [],
      fishCollected: [],
      followers: [],
      following: [],
      _id: '66e357c93572d39e66a0ba31',
      username: 'zainab_i',
      email: 'zainab.imadulla@icloud.com',
      supabaseId: '9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
      __v: 0,
    };

    userMock.mockResolvedValue(user);
    const res = await request(app).put(`/user/actions/edit`).send(updatedUser);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Successfully updated user:9f824f26-59b7-4f7f-a1b4-fef456b69bdf',
    });
  });
});

describe('GET /user/:id', () => {
  beforeEach(() => {
    userMock.mockReset();
  });

  it('Gets a specific user from id', async () => {
    const id = '9f824f26-59b7-4f7f-a1b4-fef456b69bdf';
    const user = undefined;

    userMock.mockResolvedValue(user);
    const res = await request(app).get(`/user/${id}`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Unable to find user of ID: ' + id });
  });
});
