import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import routes from './routes';
import { sessionMiddleware } from './config/sessionConfig';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../.env') });

const router = express();

mongoose
  .connect(config.mongo.url)
  .then(() => {
    console.log('connected');
    startServer();
  })
  .catch(() => {
    console.log('error');
  });

export const startServer = () => {
  initializeLogging();

  router.use(sessionMiddleware);

  router.use('/', routes());

  handleErrors();

  createServer();
};

async function initializeLogging() {
  router.use((req, res, next) => {
    console.info(
      `Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
    );

    res.on('finish', () => {
      console.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET',
      );
      return res.status(200).json({});
    }

    next();
  });
}

async function handleErrors() {
  router.use((_req, res) => {
    const error = new Error('Not found');

    console.error(error);

    res.status(404).json({
      message: error.message,
    });
  });
}

async function createServer() {
  http
    .createServer(router)
    .listen(config.server.port, () =>
      console.info(`Server is running on port ${config.server.port}`),
    );
}
