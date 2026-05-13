import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const loginSchema = z.object({
  login: z.string().min(1, 'Логин обязателен'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { login } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'lax',
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        role: user.role,
      },
      token // Также возвращаем токен для удобства фронтенда (на выбор)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true });
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, login: true, name: true, role: true }
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
};
