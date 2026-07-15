import transformerService from '../services/transformerService.js';

async function getTransformers(req, res, next) {
  try {
    const data = await transformerService.getTransformers(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export default { getTransformers };
