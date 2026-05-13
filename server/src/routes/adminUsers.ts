import { Router } from 'express';
import * as adminUsersController from '../controllers/adminUsers';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

// Список персонала доступен и Админам, и Менеджерам
router.get('/staff', requireRole(['ADMIN', 'MANAGER']), adminUsersController.getStaffList);

// Остальное управление пользователями — только для ADMIN
router.use(requireRole(['ADMIN']));
router.get('/', adminUsersController.getUsers);
router.post('/', adminUsersController.createUser);
router.patch('/:id/role', adminUsersController.updateRole);
router.delete('/:id', adminUsersController.deleteUser);


export { router as adminUsersRouter };
