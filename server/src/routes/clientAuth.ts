import { Router } from 'express';
import * as clientAuthController from '../controllers/clientAuth';
import { authenticateClient } from '../middleware/clientAuth';

const router = Router();

router.post('/request-otp', clientAuthController.requestOtp);
router.post('/verify-otp', clientAuthController.verifyOtp);
router.post('/logout', clientAuthController.logout);
router.get('/me', authenticateClient as any, clientAuthController.getMe);

// Telegram Auth
router.post('/request-tg-session', clientAuthController.requestTelegramSession);
router.get('/check-tg-session/:sessionId', clientAuthController.checkTelegramSession);

export { router as clientAuthRouter };
