import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, DeliveryType, NoteType, EstimateType } from '@prisma/client';
import { notificationService } from '../services/NotificationService';

const prisma = new PrismaClient();

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      search, 
      masterId, 
      from, 
      to, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Построение фильтра
    const where: any = {};
    
    if (status && status !== 'ALL') {
      where.status = status as OrderStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search), mode: 'insensitive' } },
        { clientName: { contains: String(search), mode: 'insensitive' } },
        { clientPhone: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (masterId) {
      where.masterId = String(masterId);
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(String(from));
      if (to) where.createdAt.lte = new Date(String(to));
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { [String(sortBy)]: sortOrder },
        include: {
          master: { select: { id: true, name: true } },
          client: { select: { id: true, telegramId: true } },
          _count: { select: { notes: true } }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      orders,
      total,
      pages: Math.ceil(total / take),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Ошибка при получении списка заказов' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: String(id) },
      include: {
        master: { select: { id: true, name: true, login: true, role: true } },
        client: { select: { id: true, telegramId: true, createdAt: true } },
        notes: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        estimate: true
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Заказ не найден' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении заказа' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, masterId } = req.body;

  try {
    const oldOrder = await prisma.order.findUnique({ where: { id: String(id) } });

    const updatedOrder = await prisma.order.update({
      where: { id: String(id) },
      data: { 
        status: status as OrderStatus,
        masterId: masterId !== undefined ? masterId : undefined
      }
    });

    if (oldOrder && oldOrder.status !== status) {
      await notificationService.notifyStatusChange(updatedOrder, status as OrderStatus);
    }
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update status/master error:', error);
    res.status(500).json({ success: false, error: 'Ошибка при обновлении заказа' });
  }
};

export const updateClientData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { clientName, clientPhone } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: String(id) },
      data: { clientName, clientPhone }
    });
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при обновлении данных клиента' });
  }
};

export const updateEstimate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { items } = req.body; // Array of items

  try {
    // Простой способ: удаляем старые и записываем новые (транзакцией)
    await prisma.$transaction([
      prisma.estimateItem.deleteMany({ where: { orderId: String(id) } }),
      prisma.estimateItem.createMany({
        data: items.map((item: any) => ({
          orderId: String(id),
          name: item.name,
          type: item.type as EstimateType,
          qty: item.qty,
          price: item.price
        }))
      })
    ]);

    const updatedOrder = await prisma.order.findUnique({
      where: { id: String(id) },
      include: { estimate: true }
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при обновлении сметы' });
  }
};

export const addNote = async (req: any, res: Response) => {
  const { id } = req.params;
  const { text, type } = req.body;

  try {
    const note = await prisma.orderNote.create({
      data: {
        orderId: String(id),
        authorId: req.user.id,
        text,
        type: type as NoteType
      },
      include: { author: { select: { id: true, name: true } } }
    });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при добавлении заметки' });
  }
};
