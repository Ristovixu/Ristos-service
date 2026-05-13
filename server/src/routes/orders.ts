import { Router } from 'express';
import { createOrder, getOrderStatus, getAllOrders, updateOrder } from '../controllers/orderController';
import { authenticateJWT, requireRole } from '../middleware/auth';

export const ordersRouter = Router();

// Public routes
ordersRouter.post('/', createOrder);
ordersRouter.get('/status', getOrderStatus);

// Admin routes
ordersRouter.get('/', authenticateJWT, requireRole(['ADMIN', 'MANAGER']), getAllOrders);
ordersRouter.patch('/:id', authenticateJWT, requireRole(['ADMIN', 'MANAGER']), updateOrder);
