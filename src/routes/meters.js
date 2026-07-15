import { Router } from 'express';
import meterController from '../controllers/meterController.js';

const router = Router();

router.get('/search', meterController.search);
router.get('/:meterId/geo', meterController.getGeo);
router.get('/:meterId/energy', meterController.getEnergy);

export default router;
