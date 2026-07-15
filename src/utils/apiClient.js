import axios from 'axios';
import env from '../config/env.js';

const apiClient = axios.create({
  baseURL: env.LEGACY_PORTAL_URL,
  withCredentials: true
});

export default apiClient;
