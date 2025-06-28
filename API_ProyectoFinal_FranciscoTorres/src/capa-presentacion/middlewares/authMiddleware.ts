import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../capa-negocio/services/AuthService';
import { JwtGenerator } from '../../jwt.adapter';
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Acceso no autorizado' });
      return;
    }

    const decoded = await JwtGenerator.validateToken(token);
    (req as any).user = decoded;
  
    if (decoded===null){ res.status(401).json({ error: 'Por favor autentíquese' });
  }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor autentíquese' });
  }
};
