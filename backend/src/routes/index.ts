import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';
import user from './User';

const router = express.Router();
export default (): express.Router => {
  console.log();
  authentification(router);
  healthcheck(router);
  user(router);
  return router;
};
