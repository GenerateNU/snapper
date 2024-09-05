import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import routes from '../routes';

const app = express();
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { connectTimeoutMS: 10000 });
  app.use(express.json());
  app.use('/', routes());
}, 15000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /auth/register', () => {
  it('should create a new user with valid email and username', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', username: 'testuser' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should return 400 if email or username is missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
  });

  it('should return 400 if email is invalid', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'testexample.com' });

    expect(response.status).toBe(400);
  });

  it('should return 400 if user already exists', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', username: 'testuser' });

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', username: 'testuser' });

    expect(response.status).toBe(400);
  });
});
