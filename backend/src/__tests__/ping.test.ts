import request from 'supertest';
import express from 'express';
import pingRoute from '../routes/healthcheck'; // Adjust to the correct file path

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
pingRoute(router);
app.use(router);

describe('GET /ping', () => {
  it('should return 200 with "hello: world"', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hello: 'world' });
  });
});
