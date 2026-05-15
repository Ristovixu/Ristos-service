import { Router } from 'express';
import * as clientCabinetController from '../controllers/clientCabinet';
import { authenticateClient } from '../middleware/clientAuth';

const router = Router();

router.use(authenticateClient as any);

router.get('/orders', clientCabinetController.getClientOrders);
router.get('/devices', clientCabinetController.getClientDevices);
router.post('/devices', clientCabinetController.addClientDevice);
router.delete('/devices/:id', clientCabinetController.deleteClientDevice);

export { router as clientCabinetRouter };
