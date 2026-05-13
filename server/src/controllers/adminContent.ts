import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- УСЛУГИ (Services) ---

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' }
      ]
    });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении услуг' });
  }
};

export const createService = async (req: Request, res: Response) => {
  const { category, name, priceFrom, time } = req.body;
  try {
    const service = await prisma.service.create({
      data: { category, name, priceFrom: Number(priceFrom), time }
    });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при создании услуги' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (data.priceFrom) data.priceFrom = Number(data.priceFrom);
    const service = await prisma.service.update({
      where: { id: String(id) },
      data
    });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при обновлении услуги' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.service.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при удалении услуги' });
  }
};

export const reorderServices = async (req: Request, res: Response) => {
  const { orders } = req.body; // Array of { id, sortOrder }
  try {
    await prisma.$transaction(
      orders.map((item: any) => 
        prisma.service.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при сортировке' });
  }
};

// --- ОТЗЫВЫ (Reviews) ---

export const getReviews = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    const reviews = await prisma.review.findMany({
      where: status ? { status: String(status) } : {},
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении отзывов' });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const review = await prisma.review.update({
      where: { id: String(id) },
      data: { status }
    });
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при модерации отзыва' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при удалении отзыва' });
  }
};

// --- СТРАНИЦЫ (Pages) ---

export const getPage = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const page = await prisma.page.findUnique({ where: { slug: String(slug) } });
    if (!page) {
      return res.status(404).json({ success: false, error: 'Страница не найдена' });
    }
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении страницы' });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { content, title } = req.body;
  try {
    const page = await prisma.page.upsert({
      where: { slug: String(slug) },
      update: { content, title },
      create: { slug: String(slug), content, title }
    });
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при сохранении страницы' });
  }
};

export const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await prisma.page.findMany({
      select: { slug: true, title: true, updatedAt: true }
    });
    res.json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении списка страниц' });
  }
};

