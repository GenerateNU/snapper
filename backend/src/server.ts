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
import { serve, setup } from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import compression from 'compression';

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

const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'Snapper API',
      version: '1.0.0',
    },
  },
  apis: ['src/routes/*.ts'],
};

const spec = swaggerJsDoc(options);

export const startServer = () => {
  initializeLogging();

  router.use(compression({ threshold: 0 }));

  router.use(sessionMiddleware);

  router.use('/api-docs', serve, setup(spec));

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

  //TODO decouple middleware from server logic
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json({ limit: '50mb' }));

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
