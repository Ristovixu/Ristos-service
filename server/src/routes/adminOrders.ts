import { Router } from 'express';
import * as adminOrdersController from '../controllers/adminOrders';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Все роуты здесь требуют авторизации
router.use(authenticateJWT);

// Просмотр списка доступен всем сотрудникам
router.get('/', adminOrdersController.getOrders);

// Детали заказа
router.get('/:id', adminOrdersController.getOrderById);

// Обновление статуса
router.patch('/:id/status', adminOrdersController.updateOrderStatus);

// Редактирование данных клиента
router.patch('/:id/client', adminOrdersController.updateClientData);

// Обновление сметы
router.put('/:id/estimate', adminOrdersController.updateEstimate);

// Добавление заметок
router.post('/:id/notes', adminOrdersController.addNote);

export { router as adminOrdersRouter };
