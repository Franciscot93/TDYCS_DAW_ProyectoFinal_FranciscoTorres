import express, { Request, Response,Router } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
interface IIdUsuarioParams {
    idUsuario: string;
}

interface IEmailParams {
    email: string;
}

interface IIdParams {
    id: string;
}
const usuarioRepo = new UsuarioRepository();
const router:Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioRepo.crear(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario en la base de datos' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log("listar todos - datos");
    const usuarios = await usuarioRepo.listarTodos();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/usuarios/:idUsuario', async (req: Request<IIdUsuarioParams>, res: Response): Promise<Response> => {
    try {
        const usuario:any = await usuarioRepo.obtenerPorId(req.params.idUsuario)
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(usuario);
    } catch (error) {
      console.log(error);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
});


router.get('/email/:email', async (req: Request<IEmailParams>, res: Response): Promise<Response> => {
    try {
        const usuario = await usuarioRepo.obtenerPorEmail(req.params.email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(usuario);
    } catch (error) {
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const usuarioActualizado = await usuarioRepo.actualizar(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await usuarioRepo.eliminar(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;