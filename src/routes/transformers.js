import { Router } from 'express';
import transformerController from '../controllers/transformerController.js';

const router = Router();

router.get('/', transformerController.getTransformers);

export default router;
