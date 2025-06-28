import express,{ Request, Response } from 'express';
import { UsuarioController } from '../../capa-presentacion/controllers/UsuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';


const router = express.Router();

const usuarioController = new UsuarioController();

router.post('/usuarios',(req: Request, res: Response)=> {usuarioController.crearUsuario(req,res)});
router.post('/usuarios/login', usuarioController.login);
router.get('/usuarios', authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.listarUsuarios(req,res)});
router.get('/usuarios/:idUsuario',authMiddleware, roleMiddleware(['admin','doctor','paciente']),(req: Request, res: Response) =>{ usuarioController.obtenerPorId(req,res)});
router.put('/usuarios/:idUsuario',authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.actualizarUsuario(req,res)});
router.delete('/usuarios/:idUsuario',authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.eliminarUsuario(req, res)});

export default router;