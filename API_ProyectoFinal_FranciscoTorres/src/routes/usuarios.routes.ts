import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const router = express.Router();
const usuarioController = new UsuarioController();

router.post('/usuarios', usuarioController.crearUsuario);
router.get('/usuarios', usuarioController.obtenerUsuarios);
router.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);
router.put('/usuarios/:id', usuarioController.actualizarUsuario);
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

export default router;