import express from 'express';
import { TurnoController } from '../controllers/TurnoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
const router = express.Router();
const turnoController = new TurnoController();

router.post('/turnos',authMiddleware,roleMiddleware(['admin','doctor','paciente']) ,turnoController.crearTurno);
router.get('/turnos', authMiddleware, roleMiddleware(['admin']),turnoController.obtenerTurnos);
router.get('/turnos/:id',authMiddleware, roleMiddleware(['admin','doctor','paciente']) ,turnoController.obtenerTurnoPorId);
router.put('/turnos/:id', authMiddleware, roleMiddleware(['admin']),turnoController.actualizarTurno);
router.delete('/turnos/:id', authMiddleware, roleMiddleware(['admin']), turnoController.eliminarTurno);
router.get('/turnos/doctor/:doctorId',authMiddleware, roleMiddleware(['admin','doctor']) ,turnoController.obtenerTurnosPorDoctor);
router.get('/turnos/paciente/:pacienteId',authMiddleware, roleMiddleware(['admin','doctor','paciente']), turnoController.obtenerTurnosPorPaciente);

export default router;