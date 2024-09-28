import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';
import fish from './fish';
import divelog from './divelog';
import swagger from './swagger';

const router = express.Router();
export default (): express.Router => {
  authentification(router);
  healthcheck(router);
  fish(router);
  divelog(router);
  swagger(router);
  return router;
};
