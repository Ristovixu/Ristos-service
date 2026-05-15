import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ordersRouter } from './routes/orders';
import { authRouter } from './routes/auth';
import { adminOrdersRouter } from './routes/adminOrders';
import { adminContentRouter } from './routes/adminContent';
import { analyticsRouter } from './routes/analytics';
import { adminUsersRouter } from './routes/adminUsers';

import { clientAuthRouter } from './routes/clientAuth';
import { clientCabinetRouter } from './routes/clientCabinet';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/content', adminContentRouter);
app.use('/api/admin/analytics', analyticsRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/client/auth', clientAuthRouter);
app.use('/api/client/cabinet', clientCabinetRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
