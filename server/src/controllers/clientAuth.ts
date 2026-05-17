import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { addMinutes } from 'date-fns';

const prisma = new PrismaClient();

export const requestOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Generate 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = addMinutes(new Date(), 5);

  try {
    // Save OTP to database
    await prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });

    // MOCK SMS SENDING
    console.log(`[SMS MOCK] Code for ${phone}: ${code}`);
    
    // In production, use Twilio or SMS.ru here
    // await sendSms(phone, `Your code: ${code}`);

    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }

  try {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    // Mark as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find or create client
    let client = await prisma.client.findUnique({
      where: { phone },
    });

    if (!client) {
      client = await prisma.client.create({
        data: { phone },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: client.id, phone: client.phone, role: 'CLIENT' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, client, token });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('client_token');
  res.json({ success: true, message: 'Logged out' });
};

// --- Telegram Auth ---

export const requestTelegramSession = async (req: Request, res: Response) => {
  try {
    const token = `auth_${Math.random().toString(36).substring(2, 15)}`;
    const expiresAt = addMinutes(new Date(), 10);

    const session = await prisma.telegramSession.create({
      data: {
        token,
        expiresAt
      }
    });

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'pixelfix_bot';
    const botLink = `https://t.me/${botUsername}?start=${token}`;

    res.json({ success: true, sessionId: session.id, botLink });
  } catch (error) {
    console.error('Request TG session error:', error);
    res.status(500).json({ success: false, error: 'Ошибка создания сессии' });
  }
};

export const checkTelegramSession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId as string;
    const session = await prisma.telegramSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) return res.status(404).json({ success: false, error: 'Сессия не найдена' });

    if (session.status === 'AUTHORIZED' && session.chatId) {
      let client = await prisma.client.findFirst({
        where: { telegramId: session.chatId }
      });

      if (!client) {
        // Create client if didn't exist (though bot listener should have created it)
        client = await prisma.client.create({
          data: {
            phone: `TG-${session.chatId}`,
            telegramId: session.chatId
          }
        });
      }

      const token = jwt.sign(
        { id: client.id, role: 'CLIENT' },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '7d' }
      );

      res.cookie('client_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Cleanup session
      await prisma.telegramSession.delete({ where: { id: sessionId } });

      return res.json({ 
        success: true, 
        client: { id: client.id, phone: client.phone, name: client.name },
        token
      });
    }

    if (new Date() > session.expiresAt) {
      await prisma.telegramSession.update({ where: { id: sessionId }, data: { status: 'EXPIRED' } });
      return res.json({ success: false, status: 'EXPIRED' });
    }

    res.json({ success: false, status: 'PENDING' });
  } catch (error) {
    console.error('Check TG session error:', error);
    res.status(500).json({ success: false, error: 'Ошибка проверки сессии' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: { orders: true, devices: true }
        }
      }
    });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get client info' });
  }
};
