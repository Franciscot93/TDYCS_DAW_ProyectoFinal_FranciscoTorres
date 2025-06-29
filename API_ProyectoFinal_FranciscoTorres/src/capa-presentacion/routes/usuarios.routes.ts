import express,{ Request, Response } from 'express';
import { UsuarioController } from '../../capa-presentacion/controllers/UsuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';


const router = express.Router();
router.options('/usuarios', (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(200).end();
});

router.options('/usuarios/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
  res.status(200).end();
});
const usuarioController = new UsuarioController();

router.post('/usuarios',(req: Request, res: Response)=> {usuarioController.crearUsuario(req,res)});
router.get('/usuarios', authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.listarUsuarios(req,res)});
router.get('/usuarios/:id',authMiddleware, roleMiddleware(['admin','doctor','paciente']),(req: Request, res: Response) =>{ usuarioController.obtenerPorId(req,res)});
router.put('/usuarios/:id',authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.actualizarUsuario(req,res)});
router.delete('/usuarios/:id',authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) =>{ usuarioController.eliminarUsuario(req, res)});
router.patch('/usuarios/:id',authMiddleware, roleMiddleware(['admin']),(req: Request, res: Response) => {usuarioController.actualizarParcialUsuario(req, res);
  }
)
export default router;