jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return next();
  },
}));

import request from 'supertest';
import express from 'express';
import pingRoute from '../routes/healthcheck';
import { isAuthenticated } from '../middlewares/authMiddleware';

const app = express();
const router = express.Router();

app.use(isAuthenticated);

pingRoute(router);
app.use(router);

describe('GET /ping', () => {
  it('should return 200 with "hello: world"', async () => {
    const res = await request(app).get('/ping');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hello: 'world' });
  });
});
