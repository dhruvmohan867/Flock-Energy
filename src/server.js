import app from './app.js';
import env from './config/env.js';
import authService from './services/authService.js';

async function start() {
  await authService.login();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
