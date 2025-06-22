import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { Doctor } from '../models/Doctor';
import { Paciente } from '../models/Paciente';
import { AuthService } from '../services/AuthService';

export class UsuarioController {
  public async crearUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { rol, ...userData } = req.body;

      // Validar campos requeridos
      if (!userData.email || !userData.password || !userData.nombre || !userData.apellido || !userData.telefono || !userData.dni) {
        res.status(400).json({ error: 'Faltan campos requeridos' });
        return;
      }

      // Crear usuario base
      const usuario = new Usuario({
        ...userData,
        rol
      });

      await usuario.save();

      // Crear perfil específico según el rol
      let perfilEspecifico;
      if (rol === 'doctor') {
        if (!req.body.especialidad || !req.body.matricula) {
          await Usuario.findByIdAndDelete(usuario._id);
          res.status(400).json({ error: 'Faltan campos requeridos para doctor' });
          return;
        }

        perfilEspecifico = new Doctor({
          usuario: usuario._id,
          especialidad: req.body.especialidad,
          matricula: req.body.matricula,
          horarioAtencion: req.body.horarioAtencion || undefined
        });
      } else if (rol === 'paciente') {
        perfilEspecifico = new Paciente({
          usuario: usuario._id,
          obraSocial: req.body.obraSocial || undefined,
          numeroAfiliado: req.body.numeroAfiliado || undefined
        });
      }

      if (perfilEspecifico) {
        await perfilEspecifico.save();
      }

      // Generar token de autenticación
      const token = AuthService.generateToken(usuario);

      // Preparar respuesta
      const usuarioResponse = usuario.toObject();
      const {password,...restoDelUsuario}=usuarioResponse

      res.status(201).json({
        usuario: {...restoDelUsuario},
        token,
        perfil: perfilEspecifico ? perfilEspecifico.toObject() : null
      });

    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'El email o DNI ya está registrado' });
      } else {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear usuario' });
      }
    }
  }

  public async obtenerUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await Usuario.find().select('-password');
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
    }
  }

  public async obtenerUsuarioPorId(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await Usuario.findById(req.params.id).select('-password');
      
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      // Obtener perfil específico
      let perfil = null;
      if (usuario.rol === 'doctor') {
        perfil = await Doctor.findOne({ usuario: usuario._id });
      } else if (usuario.rol === 'paciente') {
        perfil = await Paciente.findOne({ usuario: usuario._id });
      }

      res.status(200).json({
        usuario,
        perfil
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener usuario' });
    }
  }

  public async actualizarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // No permitir actualizar ciertos campos directamente
      if (updateData.password || updateData.rol || updateData._id) {
        res.status(400).json({ error: 'No se puede actualizar este campo' });
        return;
      }

      const usuario = await Usuario.findByIdAndUpdate(id, updateData, { 
        new: true,
        runValidators: true 
      }).select('-password');

      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      // Actualizar perfil específico si es necesario
      if (usuario.rol === 'doctor' && (updateData.especialidad || updateData.matricula)) {
        await Doctor.findOneAndUpdate(
          { usuario: usuario._id },
          {
            especialidad: updateData.especialidad,
            matricula: updateData.matricula,
            ...(updateData.horarioAtencion && { horarioAtencion: updateData.horarioAtencion })
          },
          { new: true, runValidators: true }
        );
      } else if (usuario.rol === 'paciente' && (updateData.obraSocial || updateData.numeroAfiliado)) {
        await Paciente.findOneAndUpdate(
          { usuario: usuario._id },
          {
            obraSocial: updateData.obraSocial,
            numeroAfiliado: updateData.numeroAfiliado
          },
          { new: true }
        );
      }

      res.status(200).json(usuario);
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'El email o DNI ya está registrado' });
      } else {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar usuario' });
      }
    }
  }

  public async eliminarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Primero eliminar el perfil específico si existe
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      if (usuario.rol === 'doctor') {
        await Doctor.deleteOne({ usuario: usuario._id });
      } else if (usuario.rol === 'paciente') {
        await Paciente.deleteOne({ usuario: usuario._id });
      }

      // Luego eliminar el usuario
      await Usuario.findByIdAndDelete(id);

      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar usuario' });
    }
  }

  public async obtenerPerfil(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = (req as any).user.id;

      const usuario = await Usuario.findById(usuarioId).select('-password');
      if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      let perfil = null;
      if (usuario.rol === 'doctor') {
        perfil = await Doctor.findOne({ usuario: usuario._id });
      } else if (usuario.rol === 'paciente') {
        perfil = await Paciente.findOne({ usuario: usuario._id });
      }

      res.status(200).json({
        usuario,
        perfil
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener perfil' });
    }
  }
}