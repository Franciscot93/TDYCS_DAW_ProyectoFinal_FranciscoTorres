import express from 'express';
import { TurnoController } from '../controllers/TurnoController';

const router = express.Router();
const turnoController = new TurnoController();

router.post('/turnos', turnoController.crearTurno);
router.get('/turnos', turnoController.obtenerTurnos);
router.get('/turnos/:id', turnoController.obtenerTurnoPorId);
router.put('/turnos/:id', turnoController.actualizarTurno);
router.delete('/turnos/:id', turnoController.eliminarTurno);
router.get('/turnos/doctor/:doctorId', turnoController.obtenerTurnosPorDoctor);
router.get('/turnos/paciente/:pacienteId', turnoController.obtenerTurnosPorPaciente);

export default router;