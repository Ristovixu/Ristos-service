import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClientOrders = async (req: any, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { clientId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        estimate: true,
        notes: {
          where: { type: 'PUBLIC' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getClientDevices = async (req: any, res: Response) => {
  try {
    const devices = await prisma.device.findMany({
      where: { clientId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, devices });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

export const addClientDevice = async (req: any, res: Response) => {
  const { type, model } = req.body;
  try {
    const device = await prisma.device.create({
      data: {
        clientId: req.user.id,
        type,
        model
      }
    });
    res.json({ success: true, device });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add device' });
  }
};

export const deleteClientDevice = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.device.delete({
      where: { 
        id,
        clientId: req.user.id // Ensure client owns the device
      }
    });
    res.json({ success: true, message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete device' });
  }
};
