import authService from '../services/authService.js';

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export default { login };
