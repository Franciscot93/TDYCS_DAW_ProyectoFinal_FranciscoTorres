import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config';

export class AuthController {
  private baseUrl = `http://localhost:${config.ports.negocio}/auth`;

  private standardErrorResponse(error: any, req: Request, statusCode = 500) {
    return {
      error: error.message || 'Error del servidor',
      path: req.path,
      timestamp: new Date().toISOString(),
      _links: {
        documentation: { href: '/api-docs' },
        support: { href: 'mailto:UNSTA@UNSTA.com' }
      },
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  async login(req: Request, res: Response) {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, req.body);
      const { token, usuario } = response.data;
      
      res.json({
        token,
        usuario: {
          ...usuario,
          _links: {
            self: { href: `/api/v1/usuarios/${usuario.id}`, method: 'GET' },
            turnos: { href: `/api/v1/usuarios/${usuario.id}/turnos`, method: 'GET' }
          }
        },
        _links: {
          profile: { href: `/api/v1/usuarios/${usuario.id}`, method: 'GET' },
          refresh: { href: '/api/v1/auth/refresh', method: 'POST' }
        }
      });
    } catch (error: any) {
      res.status(401).json(this.standardErrorResponse(error, req, 401));
    }
  }
}