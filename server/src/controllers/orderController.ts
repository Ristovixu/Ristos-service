import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, DeliveryType } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  deviceType: z.string(),
  deviceModel: z.string().optional(),
  problemDesc: z.string(),
  name: z.string(),
  phone: z.string(),
  deliveryMode: z.enum(['COURIER', 'SELF_DROPOFF', 'IN_SHOP']).default('SELF_DROPOFF'),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const orderNumber = `TR-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        deviceType: data.deviceType,
        deviceModel: data.deviceModel,
        problemDesc: data.problemDesc,
        clientName: data.name,
        clientPhone: data.phone,
        deliveryMode: data.deliveryMode as DeliveryType,
        status: OrderStatus.RECEIVED,
      },
    });

    res.status(201).json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Create order error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
    } else {
      res.status(500).json({ success: false, error: 'Не удалось создать заказ' });
    }
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
       return res.status(400).json({ success: false, error: 'orderNumber and phone are required' });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: String(orderNumber),
        clientPhone: String(phone),
      },
      select: {
        orderNumber: true,
        status: true,
        deviceModel: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Заказ не найден' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка получения статуса' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { master: { select: { name: true } } }
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка получения списка' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, masterId } = req.body;
    
    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { 
        status: status as OrderStatus,
        masterId: masterId || undefined
      },
    });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка обновления заказа' });
  }
};
