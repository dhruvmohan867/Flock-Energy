import dotenv from 'dotenv';
dotenv.config();
export default {
  PORT: process.env.PORT || 3000,
  LEGACY_PORTAL_URL: process.env.LEGACY_PORTAL_URL || 'http://localhost:8080',
  LEGACY_EMAIL: process.env.LEGACY_EMAIL || '',
  LEGACY_PASSWORD: process.env.LEGACY_PASSWORD || ''
};