import express, { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';


const router = express.Router();
const usuarioService = new UsuarioService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const response= await usuarioService.registrarUsuario(req.body);
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error al registrar usuario',
      details: error.response?.data || error.message,
    });
  }
});
router.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const response:any= await usuarioService.obtenerPorEmail(
      req.params.id
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(404).json({
      error: 'Usuario no encontrado',
      details: error.response?.data || error.message,
    });
  }
});


router.get('/', async (req: Request, res: any) => {
  try {
   
    const response:any = await usuarioService.listarTodos();
    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al listar usuarios',
      details: error.response?.data || error.message,
    });
  }
});

router.get('/usuarios/:idUsuario', async (req: Request, res: Response) => {
  try {
    const response:any= await usuarioService.obtenerPorId(
      req.params.idUsuario
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(404).json({
      error: 'Usuario no encontrado',
      details: error.response?.data || error.message,
    });
  }
});

router.put('/usuarios/:idUsuario', async (req: Request, res: Response) => {
  try {
    
    const response = await usuarioService.actualizar(
      req.params.idUsuario,
      req.body
    );
    res.json(response);
  } catch (error: any) {
    res.status(400).json({
      error: 'Error al actualizar usuario',
      details: error.response?.data || error.message,
    });
  }
}
);

router.delete('/usuarios/:idUsuario', async (req: Request, res: Response) => {
  try {
    
    const response = await usuarioService.eliminar(
      req.params.idUsuario
    );
    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al eliminar usuario',
      details: error.response?.data || error.message,
    });
  }}
);

export default router;