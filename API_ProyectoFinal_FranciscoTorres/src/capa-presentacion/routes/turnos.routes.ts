import express,{ Request, Response } from 'express';
import { TurnoController } from '../controllers/TurnoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
const router = express.Router();
const turnoController = new TurnoController();
router.post('/turnos',authMiddleware,roleMiddleware(['admin','doctor','paciente']) ,(req:Request,res:Response)=>{turnoController.crearTurno(req,res)});
router.get('/turnos', authMiddleware, roleMiddleware(['admin']),(req:Request,res:Response)=>{turnoController.obtenerTurnos(req,res)});
router.get('/turnos/:id',authMiddleware, roleMiddleware(['admin','doctor','paciente']) ,(req:Request,res:Response)=>{turnoController.obtenerTurnoPorId(req,res)});
router.put('/turnos/:id', authMiddleware, roleMiddleware(['admin']),(req:Request,res:Response)=>{turnoController.actualizarTurno(req,res)});
router.delete('/turnos/:id', authMiddleware, roleMiddleware(['admin']),(req:Request,res:Response)=>{ turnoController.eliminarTurno(req,res)});
router.get('/turnos/doctor/:doctorId',authMiddleware, roleMiddleware(['admin','doctor']) ,(req:Request,res:Response)=>{turnoController.obtenerTurnosPorDoctor(req,res)});
router.get('/turnos/paciente/:pacienteId',authMiddleware, [roleMiddleware(['admin','doctor','paciente'])], (req:Request,res:Response)=>{turnoController.obtenerTurnosPorPaciente(req,res)});

export default router;