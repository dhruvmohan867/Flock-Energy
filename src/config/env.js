import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: process.env.PORT || 3000,
  LEGACY_PORTAL_URL: process.env.LEGACY_PORTAL_URL || 'http://localhost:8080',
};

export default env;
