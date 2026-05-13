import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, login: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении списка пользователей' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { login, password, name, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Логин уже занят' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { login, password: hashedPassword, name, role: role as Role }
    });

    res.json({ success: true, user: { id: user.id, login: user.login, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при создании пользователя' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: String(id) },
      data: { role: role as Role }
    });
    res.json({ success: true, user: { id: user.id, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при обновлении роли' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === (req as any).user.id) {
    return res.status(400).json({ success: false, error: 'Нельзя удалить самого себя' });
  }
  try {
    await prisma.user.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при удалении пользователя' });
  }
};

export const getStaffList = async (req: Request, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      select: { id: true, name: true, role: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка при получении списка персонала' });
  }
};

