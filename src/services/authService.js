import axios from 'axios';
import env from '../config/env.js';
import cookieManager from '../utils/cookieManager.js';
let loginPromise = null;

async function login() {
  if (loginPromise) {
    return loginPromise;
  }
  loginPromise = axios.post(`${env.LEGACY_PORTAL_URL}/login`, {
    email: env.LEGACY_EMAIL,
    password: env.LEGACY_PASSWORD
  }).then((response) => {
    const cookies = response.headers['set-cookie'];
    if (cookies && cookies.length > 0) {
      const sessionCookie = cookies[0].split(';')[0];
      cookieManager.setCookie(sessionCookie);
    }
  }).finally(() => {
    loginPromise = null;
  });
  return loginPromise;
}
export default { login };