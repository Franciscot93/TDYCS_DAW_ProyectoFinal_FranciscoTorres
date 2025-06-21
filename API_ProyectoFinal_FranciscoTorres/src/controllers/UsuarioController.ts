import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { Doctor } from '../models/Doctor';
import { Paciente } from '../models/Paciente';

export class UsuarioController {
  public async crearUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { rol, ...userData } = req.body;
      
      let nuevoUsuario;
      if (rol === 'doctor') {
        nuevoUsuario = new Doctor(userData);
      } else if (rol === 'paciente') {
        nuevoUsuario = new Paciente(userData);
      } else {
        nuevoUsuario = new Usuario(req.body);
      }

      await nuevoUsuario.save();
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }

  public async obtenerUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await Usuario.find();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  public async obtenerUsuarioPorId(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }

  public async actualizarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  public async eliminarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await Usuario.findByIdAndDelete(req.params.id);
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
}