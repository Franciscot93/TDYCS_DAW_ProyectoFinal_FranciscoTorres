import express,{ Request, Response } from 'express';
import { UsuarioController } from '../../capa-presentacion/controllers/UsuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioService } from '../../capa-negocio/services/UsuarioService';
import { PacienteService } from '../../capa-negocio/services/PacienteService';
import { DoctorService } from '../../capa-negocio/services/DoctorService';

const router = express.Router();
const usuarioService=new UsuarioService()
const pacienteService=new PacienteService()
const doctorService=new DoctorService()
const usuarioController = new UsuarioController(usuarioService,pacienteService,doctorService);

router.post('/usuarios', usuarioController.crearUsuario);
router.get('/usuarios', authMiddleware, roleMiddleware(['admin']), usuarioController.listarUsuarios);
router.get('/usuarios/:id',authMiddleware, roleMiddleware(['admin','doctor','paciente']), usuarioController.obtenerPorId);
router.put('/usuarios/:id',authMiddleware, roleMiddleware(['admin']), usuarioController.actualizarUsuario);
router.delete('/usuarios/:id',authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.eliminarUsuario(req, res)});

export default router;