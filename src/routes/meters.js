import { Router } from 'express';
import meterController from '../controllers/meterController.js';
import { validatePage, validateMeterId } from '../middlewares/validate.js';
const router = Router();
router.get('/', validatePage, meterController.getMeters);
router.get('/:meterId/geo', validateMeterId, meterController.getMeterGeo);
router.get('/:meterId/energy', validateMeterId, meterController.getMeterEnergy);
export default router;