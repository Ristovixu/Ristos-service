import { Router } from 'express';
import * as authController from '../controllers/auth';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateJWT, authController.getMe);

export { router as authRouter };
