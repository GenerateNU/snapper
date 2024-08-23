import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';

const router = express();

async function initializeRoutes() {
    /** Routes */

    /** Healthcheck */
    router.get('/ping', (_req, res) => res.status(200).json({ hello: 'world' }));
}

mongoose
    .connect(config.mongo.url)
    .then(() => {
        console.log('connected');
        startServer();
    })
    .catch(() => {
        console.log('error');
    });

const startServer = () => {
    initializeLogging();

    initializeRoutes();

    handleErrors();

    createServer();
};

async function initializeLogging() {
    router.use((req, res, next) => {
        console.info(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            console.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
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
            message: error.message
        });
    });
}

async function createServer() {
    http.createServer(router).listen(config.server.port, () => console.info(`Server is running on port ${config.server.port}`));
}
