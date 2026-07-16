import axios from 'axios';
import env from '../config/env.js';
import cookieManager from './cookieManager.js';
import authService from '../services/authService.js';

const apiClient = axios.create({
  baseURL: env.LEGACY_PORTAL_URL,
  withCredentials: true,
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  const cookie = cookieManager.getCookie();
  if (cookie) {
    config.headers.Cookie = cookie;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await authService.login();
      const newCookie = cookieManager.getCookie();
      if (newCookie) {
        originalRequest.headers.Cookie = newCookie;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
