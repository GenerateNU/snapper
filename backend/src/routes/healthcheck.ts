import express from 'express';

export default (router: express.Router) => {
    router.get('/ping', (_req, res) => res.status(200).json({ hello: 'world' }));
};
