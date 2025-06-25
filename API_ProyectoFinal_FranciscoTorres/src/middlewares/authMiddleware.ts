import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Acceso no autorizado' });
      return;
    }

    const decoded = await AuthService.verifyToken(token);
    (req as any).user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor autentíquese' });
  }
};
