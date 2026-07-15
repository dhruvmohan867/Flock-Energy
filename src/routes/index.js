import { Router } from 'express';
import authRoutes from './auth.js';
import meterRoutes from './meters.js';
import transformerRoutes from './transformers.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/meters', meterRoutes);
router.use('/transformers', transformerRoutes);

export default router;
