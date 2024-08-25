import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';

const router = express.Router();
export default (): express.Router => {
  authentification(router);
  healthcheck(router);
  return router;
};
