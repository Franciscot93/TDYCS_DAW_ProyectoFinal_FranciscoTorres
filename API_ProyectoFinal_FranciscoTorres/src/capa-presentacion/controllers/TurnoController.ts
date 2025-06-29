import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config';
import etag from 'etag';

export class TurnoController {
  private baseUrl = `http://localhost:${config.ports.negocio}/turnos`;

  private generateTurnoLinks(turnoId: string) {
    return {
      self: { href: `/api/v1/turnos/${turnoId}`, method: 'GET' },
      update: { href: `/api/v1/turnos/${turnoId}`, method: 'PUT' },
      partialUpdate: { href: `/api/v1/turnos/${turnoId}`, method: 'PATCH' },
      delete: { href: `/api/v1/turnos/${turnoId}`, method: 'DELETE' },
      doctor: { href: `/api/v1/usuarios/{doctorId}`, method: 'GET' }, // {doctorId} será reemplazado
      paciente: { href: `/api/v1/usuarios/{pacienteId}`, method: 'GET' } // {pacienteId} será reemplazado
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

  async crearTurno(req: Request, res: Response) {
    try {
      const pacienteId = (req as any).user._id || (req as any).user.id;
      const response = await axios.post(`${this.baseUrl}`, {
        ...req.body,
        paciente: pacienteId
      });
      
      const turno = response.data;
      console.log(turno);
      const links = this.generateTurnoLinks(turno.id||turno._id);
      
      links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
      links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);

      res.status(201).json({
        ...turno,
        _links: links
      });
    } catch (error: any) {
      const status = error.response?.status || 400;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async obtenerTurnos(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const response = await axios.get(`${this.baseUrl}`, {
        params: { page, limit }
      });

      const turnos = response.data.items || response.data;
      const total = response.data.total || turnos.length;

      const etagValue = etag(JSON.stringify(turnos));
      if (req.headers['if-none-match'] === etagValue) {
        return res.status(304).end();
      }

      res.set('ETag', etagValue);
      res.set('Cache-Control', 'public, max-age=3600');

      res.json({
        _embedded: {
          turnos: turnos.map((turno: any) => {
            const links = this.generateTurnoLinks(turno.id||turno._id);
            links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
            links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);
            
            return {
              ...turno,
              _links: links
            };
          })
        },
        _links: {
          self: { href: `/api/v1/turnos?page=${page}&limit=${limit}`, method: 'GET' },
          next: total > Number(page) * Number(limit) ? {
            href: `/api/v1/turnos?page=${Number(page) + 1}&limit=${limit}`,
            method: 'GET'
          } : null,
          prev: Number(page) > 1 ? {
            href: `/api/v1/turnos?page=${Number(page) - 1}&limit=${limit}`,
            method: 'GET'
          } : null,
          create: { href: '/api/v1/turnos', method: 'POST' }
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

  async obtenerTurnoPorId(req: Request, res: Response) {
    try {
      const response = await axios.get(`${this.baseUrl}/${req.params.id}`);
      const turno = response.data;

      const etagValue = etag(JSON.stringify(turno));
      if (req.headers['if-none-match'] === etagValue) {
        return res.status(304).end();
      }

      res.set('ETag', etagValue);
      res.set('Cache-Control', 'public, max-age=3600');

      const links = this.generateTurnoLinks(turno.id||turno._id);
      links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
      links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);

      res.json({
        ...turno,
        _links: links
      });
    } catch (error: any) {
      const status = error.response?.status || 404;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async actualizarTurno(req: Request, res: Response) {
    try {
      const response = await axios.put(`${this.baseUrl}/turnos/${req.params.id}`, req.body);
      const turno = response.data;

      const links = this.generateTurnoLinks(turno.id||turno._id);
      links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
      links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);

      res.json({
        ...turno,
        _links: links
      });
    } catch (error: any) {
      const status = error.response?.status || 500;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async eliminarTurno(req: Request, res: Response) {
    try {
      await axios.delete(`${this.baseUrl}/turnos/${req.params.id}`);
      res.status(204).end();
    } catch (error: any) {
      const status = error.response?.status || 500;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }

  async obtenerTurnosPorDoctor(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const response = await axios.get(`${this.baseUrl}/doctor/${req.params.doctorId}`, {
        params: { page, limit }
      });

      const turnos = response.data.items || response.data;
      const total = response.data.total || turnos.length;

      const etagValue = etag(JSON.stringify(turnos));
      if (req.headers['if-none-match'] === etagValue) {
        return res.status(304).end();
      }

      res.set('ETag', etagValue);
      res.set('Cache-Control', 'public, max-age=3600');

      res.json({
        _embedded: {
          turnos: turnos.map((turno: any) => {
            const links = this.generateTurnoLinks(turno.id||turno._id);
            links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
            links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);
            
            return {
              ...turno,
              _links: links
            };
          })
        },
        _links: {
          self: { 
            href: `/api/v1/turnos/doctor/${req.params.doctorId}?page=${page}&limit=${limit}`,
            method: 'GET'
          },
          doctor: {
            href: `/api/v1/usuarios/${req.params.doctorId}`,
            method: 'GET'
          }
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

  async obtenerTurnosPorPaciente(req: Request, res: Response) {
    if ((req as any).user.rol !== 'admin' && req.params.pacienteId !== (req as any).user._id) {
      return res.status(403).json({
        error: "No tienes permisos para ver estos turnos",
        _links: {
          self: { href: req.originalUrl, method: 'GET' },
          profile: { href: `/api/v1/usuarios/${(req as any).user._id}`, method: 'GET' }
        }
      });
    }

    try {
      const { page = 1, limit = 10 } = req.query;
      const response = await axios.get(`${this.baseUrl}/pacientes/${req.params.pacienteId}`, {
        params: { page, limit }
      });

      const turnos = response.data.items || response.data;
      const total = response.data.total || turnos.length;

      const etagValue = etag(JSON.stringify(turnos));
      if (req.headers['if-none-match'] === etagValue) {
        return res.status(304).end();
      }

      res.set('ETag', etagValue);
      res.set('Cache-Control', 'public, max-age=3600');

      res.json({
        _embedded: {
          turnos: turnos.map((turno: any) => {
            const links = this.generateTurnoLinks(turno.id||turno._id);
            links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
            links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);
            
            return {
              ...turno,
              _links: links
            };
          })
        },
        _links: {
          self: { 
            href: `/api/v1/turnos/paciente/${req.params.pacienteId}?page=${page}&limit=${limit}`,
            method: 'GET'
          },
          paciente: {
            href: `/api/v1/usuarios/${req.params.pacienteId}`,
            method: 'GET'
          }
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

  async actualizarParcialTurno(req: Request, res: Response) {
    try {
      const response = await axios.patch(`${this.baseUrl}/turnos/${req.params.id}`, req.body);
      const turno = response.data;

      const links = this.generateTurnoLinks(turno.id||turno._id);
      links.doctor.href = links.doctor.href.replace('{doctorId}', turno.doctor);
      links.paciente.href = links.paciente.href.replace('{pacienteId}', turno.paciente);

      res.json({
        ...turno,
        _links: links
      });
    } catch (error: any) {
      const status = error.response?.status || 500;
      res.status(status).json(this.standardErrorResponse(error, req, status));
    }
  }
}