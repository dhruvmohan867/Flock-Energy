import transformerService from '../services/transformerService.js';
async function getTransformers(req, res, next) {
  try {
    const { page } = req.query;
    const data = await transformerService.getTransformers(page);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export default { getTransformers };