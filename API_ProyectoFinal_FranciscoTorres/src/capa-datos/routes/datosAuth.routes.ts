import express, { Request, Response } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository';

const usuarioRepo = new UsuarioRepository();
const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const {email,password}=req.body
   
    const usuario = await usuarioRepo.validaLogin(email,password);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'Error al encontrar el usuario en la base de datos' });
  }
});



export default router;