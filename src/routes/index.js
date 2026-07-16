import { Router } from 'express';
import meterRoutes from './meters.js';
import transformerRoutes from './transformers.js';
const router = Router();
router.use('/meters', meterRoutes);
router.use('/transformers', transformerRoutes);
export default router;