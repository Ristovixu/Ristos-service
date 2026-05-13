import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

const prisma = new PrismaClient();

export const getOrderStats = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const startDate = from ? new Date(String(from)) : subDays(new Date(), 30);
  const endDate = to ? new Date(String(to)) : new Date();

  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      select: { status: true, createdAt: true }
    });

    const total = orders.length;
    const stats = {
      total,
      new: orders.filter(o => o.status === 'RECEIVED').length,
      inProgress: orders.filter(o => ['DIAGNOSTICS', 'APPROVAL', 'IN_REPAIR'].includes(o.status)).length,
      done: orders.filter(o => ['READY', 'ISSUED'].includes(o.status)).length,
      byDay: [] as { date: string; count: number }[]
    };

    // Группировка по дням
    const dayMap = new Map<string, number>();
    orders.forEach(o => {
      const day = format(o.createdAt, 'yyyy-MM-dd');
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });

    stats.byDay = Array.from(dayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении статистики' });
  }
};

export const getPopularRepairs = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const startDate = from ? new Date(String(from)) : subDays(new Date(), 30);
  const endDate = to ? new Date(String(to)) : new Date();

  try {
    const popular = await prisma.order.groupBy({
      by: ['deviceType'],
      _count: { deviceType: true },
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      orderBy: { _count: { deviceType: 'desc' } },
      take: 10
    });

    res.json({
      success: true,
      data: popular.map(p => ({
        deviceType: p.deviceType,
        count: p._count.deviceType
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка аналитики популярных ремонтов' });
  }
};

export const getTrafficSources = async (req: Request, res: Response) => {
  // Имитация данных из Google Analytics или UTM-меток
  // В реальном проекте данные брались бы из таблицы заявок с полем source
  res.json({
    success: true,
    data: [
      { source: 'Поиск (Google/Yandex)', count: 45 },
      { source: 'Прямой заход', count: 25 },
      { source: 'Социальные сети', count: 15 },
      { source: 'Реклама', count: 15 }
    ]
  });
};
