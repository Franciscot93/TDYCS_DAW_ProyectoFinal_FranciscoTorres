import express, { Request, Response } from 'express';
import { TurnoService } from '../services/TurnoService';
import axios from 'axios';
import { config } from '../../config';

const router = express.Router();
const turnoService = new TurnoService();


router.post('/', async (req: Request, res: Response) => {
  try {
    const pacienteId = req.body.paciente 
    const response = await turnoService.crearTurno( req.body,pacienteId )
    
    res.status(201).json(response);
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al crear turno',
      details: error.response?.data || error.message,
    });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const response = await turnoService.obtenerTurnos();
    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al obtener turnos',
      details: error.response?.data || error.message,
    });
  }
});

router.get('/turnos/:id', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `http://localhost:${config.ports.negocio}/turnos/${req.params.id}`
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(404).json({
      error: 'Turno no encontrado',
      details: error.response?.data || error.message,
    });
  }
});

router.put('/turnos/:id', async (req: Request, res: Response) => {
  try {
        console.log("ruta serv",req.params.id);

    const response = await turnoService.actualizarTurno(req.params.id,req.body);
    res.json(response);
  } catch (error: any) {
    res.status(403).json({
      error: 'No autorizado o turno no existe',
      details: error.response?.data || error.message,
    });
  }
});

router.delete('/turnos/:id', async (req: Request, res: Response) => {
  try {
    const response = await turnoService.eliminarTurno(req.params.id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al eliminar turno',
      details: error.response?.data || error.message,
    });
  }
});

router.get('/doctor/:doctorId', async (req: Request, res: Response) => {
  try {
    const response = await turnoService.obtenerTurnosDoctor(req.params.doctorId);
    res.json(response);
  } catch (error: any) {
    res.status(404).json({
      error: 'Error al obtener turnos del doctor',
      details: error.response?.data || error.message,
    });
  }
});

router.get('/pacientes/:pacienteId',async (req: Request, res: Response) => {
  try {
    const response = await turnoService.obtenerTurnosPaciente(req.params.pacienteId);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al obtener turnos del paciente',
      details: error.response?.data || error.message,
    });
  }}
);

export default router;