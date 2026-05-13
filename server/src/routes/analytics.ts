import { Router } from 'express';
import * as analyticsController from '../controllers/analytics';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'MANAGER']));

router.get('/orders', analyticsController.getOrderStats);
router.get('/popular', analyticsController.getPopularRepairs);
router.get('/traffic', analyticsController.getTrafficSources);

export { router as analyticsRouter };
