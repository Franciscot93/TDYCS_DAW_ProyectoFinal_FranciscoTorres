import express, { Request, Response } from 'express';
import { TurnoRepository } from '../repositories/TurnoRepository';

const router = express.Router();
const turnoRepo = new TurnoRepository();

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log("llega a datos",req.body);
    const turno = await turnoRepo.crear(req.body);
    res.status(201).json(turno);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear turno en la base de datos' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const turnos = await turnoRepo.obtenerTodos();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const turno = await turnoRepo.obtenerPorId(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
    res.json(turno);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }}
);

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const turnoActualizado = await turnoRepo.actualizar(req.params.id, req.body);
    res.json(turnoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar turno' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await turnoRepo.eliminar(req.params.id);
    res.json({ message: 'Turno eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar turno' });
  }
});

router.get('/doctor/:doctorId', async (req: Request, res: Response) => {
  try {
    const turnos = await turnoRepo.obtenerPorDoctor(req.params.doctorId);
        console.log(turnos);

    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar turnos' });
  }
});

router.get('/pacientes/:pacienteId', async (req: Request, res: Response) => {
  try {
    const turnos = await turnoRepo.obtenerPorPaciente(req.params.pacienteId);
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar turnos' });
  }
});

export default router;