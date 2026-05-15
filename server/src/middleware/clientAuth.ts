import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface ClientAuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    role: string;
  };
}

export const authenticateClient = (req: ClientAuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.client_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as any;
    
    if (decoded.role !== 'CLIENT') {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
