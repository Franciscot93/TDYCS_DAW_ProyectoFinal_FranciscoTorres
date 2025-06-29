import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config';
import etag from 'etag';

export class UsuarioController {
  private baseUrl = `http://localhost:${config.ports.negocio}/usuarios`;

  private generateUserLinks(userId: string) {
    return {
      self: { href: `/api/v1/usuarios/${userId}`, method: 'GET' },
      update: { href: `/api/v1/usuarios/${userId}`, method: 'PUT' },
      partialUpdate: { href: `/api/v1/usuarios/${userId}`, method: 'PATCH' },
      delete: { href: `/api/v1/usuarios/${userId}`, method: 'DELETE' },
      turnos: { href: `/api/v1/usuarios/${userId}/turnos`, method: 'GET' }
    };
  }

  private standardErrorResponse(error: any, req: Request, statusCode = 500) {
    return {
      error: error.message || 'Error del servidor',
      path: req.path,
      timestamp: new Date().toISOString(),
      _links: {
        documentation: { href: '/api-docs' },
        support: { href: 'mailto:support@clinica.com' }
      },
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  async crearUsuario(req: Request, res: Response) {
    try {
      const response = await axios.post(`${this.baseUrl}`, req.body);
      const usuario = response.data;
      
      res.status(201).json({
        ...usuario,
        _links: this.generateUserLinks(usuario.id||usuario._id)
      });
    } catch (error: any) {
      const status = error.response?.status || 400;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async eliminarUsuario(req: Request, res: Response) {
    try {
      await axios.delete(`${this.baseUrl}/usuarios/${req.params.id}`);
      res.status(204).end();
    } catch (error: any) {
      const status = error.response?.status || 500;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, req.body);
      const { token, usuario } = response.data;
      
      res.json({
        token,
        usuario: {
          ...usuario,
          _links: this.generateUserLinks(usuario.id||usuario._id)
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

  async listarUsuarios(req: Request, res: Response) {
    try {
      if ((req as any).user.rol !== 'admin') {
        return res.status(403).json({
          error: 'Acceso no autorizado',
          _links: { docs: { href: '/api-docs' } }
        });
      }

      const { page = 1, limit = 10 } = req.query;
      const response = await axios.get(`${this.baseUrl}`, {
        params: { page, limit }
      });

      const usuarios = response.data.items || response.data;
      const total = response.data.total || usuarios.length;

      const etagValue = etag(JSON.stringify(usuarios));
      if (req.headers['if-none-match'] === etagValue) {
        return res.status(304).end();
      }

      res.set('ETag', etagValue);
      res.set('Cache-Control', 'public, max-age=3600');

      res.json({
        _embedded: {
          usuarios: usuarios.map((usuario: any) => ({
            ...usuario,
            _links: this.generateUserLinks(usuario.id||usuario._id)
          }))
        },
        _links: {
          self: { href: `/api/v1/usuarios?page=${page}&limit=${limit}`, method: 'GET' },
          next: total > Number(page) * Number(limit) ? {
            href: `/api/v1/usuarios?page=${Number(page) + 1}&limit=${limit}`,
            method: 'GET'
          } : null,
          prev: Number(page) > 1 ? {
            href: `/api/v1/usuarios?page=${Number(page) - 1}&limit=${limit}`,
            method: 'GET'
          } : null,
          create: { href: '/api/v1/usuarios', method: 'POST' }
        },
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      });
    } catch (error: any) {
      res.status(500).json(this.standardErrorResponse(error, req));
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const response = await axios.get(`${this.baseUrl}/usuarios/${req.params.id}`);
      const usuario = response.data;

      const etagValue = etag(JSON.stringify(usuario));
      if (req.headers['if-none-match'] === etagValue) {
        return res.status(304).end();
      }

      res.set('ETag', etagValue);
      res.set('Cache-Control', 'public, max-age=3600');

      res.json({
        ...usuario,
        _links: this.generateUserLinks(usuario.id||usuario._id)
      });
    } catch (error: any) {
      const status = error.response?.status || 404;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async actualizarUsuario(req: Request, res: Response) {
    try {
      const response = await axios.put(`${this.baseUrl}/usuarios/${req.params.id}`, req.body);
      
      res.json({
        ...response.data,
        _links: this.generateUserLinks(req.params.id)
      });
    } catch (error: any) {
      const status = error.response?.status || 500;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async actualizarParcialUsuario(req: Request, res: Response) {
    try {
      const response = await axios.patch(`${this.baseUrl}/usuarios/${req.params.id}`, req.body);
      
      res.json({
        ...response.data,
        _links: this.generateUserLinks(req.params.id||response.data._id||response.data.id)
      });
    } catch (error: any) {
      const status = error.response?.status || 500;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }
}