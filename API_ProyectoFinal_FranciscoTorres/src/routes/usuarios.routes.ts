import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = express.Router();
const usuarioController = new UsuarioController();

router.post('/usuarios', usuarioController.crearUsuario);
router.get('/usuarios', authMiddleware, roleMiddleware(['admin']), usuarioController.obtenerUsuarios);
router.get('/usuarios/:id',authMiddleware, roleMiddleware(['admin','doctor']), usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id',authMiddleware, roleMiddleware(['admin']), usuarioController.actualizarUsuario);
router.delete('/usuarios/:id',authMiddleware, roleMiddleware(['admin']), usuarioController.eliminarUsuario);

export default router;