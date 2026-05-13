import { Router } from 'express';
import * as adminContentController from '../controllers/adminContent';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Все роуты требуют авторизации и роли ADMIN или MANAGER
router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'MANAGER']));

// Услуги
router.get('/services', adminContentController.getServices);
router.post('/services', adminContentController.createService);
router.patch('/services/reorder', adminContentController.reorderServices);
router.patch('/services/:id', adminContentController.updateService);
router.delete('/services/:id', adminContentController.deleteService);

// Отзывы
router.get('/reviews', adminContentController.getReviews);
router.patch('/reviews/:id', adminContentController.updateReviewStatus);
router.delete('/reviews/:id', adminContentController.deleteReview);

// Страницы
router.get('/pages', adminContentController.getPages);
router.get('/pages/:slug', adminContentController.getPage);
router.put('/pages/:slug', adminContentController.updatePage);

export { router as adminContentRouter };
