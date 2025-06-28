import express, { Request, Response } from 'express';
import { PacienteRepository } from '../repositories/PacienteRepository';

const pacienteRepo = new PacienteRepository();
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    
    const usuario = await pacienteRepo.crear(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario en la base de datos' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const usuarios = await pacienteRepo.listarTodos();
    
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.get('/:id',()=>{ async (req: Request, res: Response) => {
  try {
    const usuario = await pacienteRepo.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error en la base de datos' });
  }}
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const usuarioActualizado = await pacienteRepo.actualizar(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await pacienteRepo.eliminarPorUsuarioId(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;