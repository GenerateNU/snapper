import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = process.env.MONGO_URL || '';

const AWS_PUBLIC_KEY = process.env.PUBLIC_KEY_AWS || '';
const AWS_PRIVATE_KEY = process.env.SECRET_KEY_AWS || '';
const AWS_BUCKET_NAME = process.env.S3BUCKETNAME || '';
const AWS_BUCKET_REGION = process.env.S3BUCKETNAME || '';

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

export const config = {
  mongo: {
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
  supabase: {
    url: SUPABASE_URL,
    key: SUPABASE_KEY,
  },
  aws : {
    public : AWS_PUBLIC_KEY,
    private : AWS_PRIVATE_KEY,
    name : AWS_BUCKET_NAME,
    region : AWS_BUCKET_REGION
  }
};
