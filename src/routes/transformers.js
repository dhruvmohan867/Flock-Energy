import { Router } from 'express';
import transformerController from '../controllers/transformerController.js';
import { validatePage } from '../middlewares/validate.js';
const router = Router();
router.get('/', validatePage, transformerController.getTransformers);
export default router;