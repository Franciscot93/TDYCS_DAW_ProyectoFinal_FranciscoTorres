import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config';

export class TurnoController {
  private baseUrl = `http://localhost:${config.ports.negocio}/turnos`;

  async crearTurno(req: Request, res: Response) {
    try {
      const response = await axios.post(`${this.baseUrl}`, {
        ...req.body,
        paciente:(req as any).user._id ||(req as any).user.id, 
      });
      res.status(201).json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error al crear turno',
        details: error.response?.data || error.message 
      });
    }
  }

  async obtenerTurnos(req: Request, res: Response) {
    try {
      console.log("controller");
      const response = await axios.get(`${this.baseUrl}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error al obtener turnos',
        details: error.response?.data || error.message 
      });
    }
  }

  async obtenerTurnoPorId(req: Request, res: Response) {
    try {
      const response = await axios.get(`${this.baseUrl}/${req.params.id}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error al obtener el turno',
        details: error.response?.data || error.message 
      });
    }
  }

  async actualizarTurno(req: Request, res: Response) {
    try {
      const response = await axios.put(`${this.baseUrl}/turnos/${req.params.id}`, req.body);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error al actualizar el turno',
        details: error.response?.data || error.message 
      });
    }
  }

  async eliminarTurno(req: Request, res: Response) {
    try {
      const response = await axios.delete(`${this.baseUrl}/turnos/${req.params.id}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error al eliminar el turno',
        details: error.response?.data || error.message 
      });
    }
  }

  async obtenerTurnosPorDoctor(req: Request, res: Response) {
    try {
      const response = await axios.get(`${this.baseUrl}/doctor/${req.params.doctorId}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Error al obtener turnos del doctor',
        details: error.response?.data || error.message 
      });
    }
  }

  obtenerTurnosPorPaciente=async(req: Request, res: Response)=> {
    if ( (req as any).user.rol !=='admin' && req.params.pacienteId !== (req as any).user._id) {
      return res.status(403).json({ error: "No tienes permisos para ver estos turnos" });
    }
    try {
      console.log(`${this.baseUrl}/paciente/${req.params.pacienteId}`);
      const response = await axios.get(`${this.baseUrl}/pacientes/${req.params.pacienteId}`);
      res.json(response.data);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ 
        
        error: 'Error al obtener turnos del paciente',
        details: error.response?.data || error.message 
      });
    }
  }
}