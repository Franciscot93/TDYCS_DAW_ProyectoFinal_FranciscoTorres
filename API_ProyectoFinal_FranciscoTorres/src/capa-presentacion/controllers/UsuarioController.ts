import { Request, Response } from 'express';
import { UsuarioService} from '../../capa-negocio/services/UsuarioService';
import { DoctorService } from '../../capa-negocio/services/DoctorService';
import { PacienteService } from '../../capa-negocio/services/PacienteService';

export class UsuarioController {
 constructor(private readonly usuarioService:UsuarioService,private readonly pacienteService:PacienteService,private readonly doctorService:DoctorService){

 }

    crearUsuario =async(req: Request, res: Response)=> {
    try {
      
      const { rol, ...usuarioData } = req.body;
      const usuario = await this.usuarioService.registrarUsuario({
        ...usuarioData,
        rol,
      });

      let perfilCreado;
      if (rol === 'doctor') {
        perfilCreado = await this.doctorService.crearDoctor({
          usuario: usuario._id,
          especialidad: req.body.especialidad,
          matricula: req.body.matricula,
        });
      } else if (rol === 'paciente') {
        perfilCreado = await this.pacienteService.crearPaciente({
          usuario: usuario._id,
          obraSocial: req.body.obraSocial,
          numeroAfiliado: req.body.numeroAfiliado,
        });
      }

      const { password: _, ...usuarioSinPassword } = usuario.toObject();

      res.status(201).json({
        usuario: usuarioSinPassword,
        perfil: perfilCreado,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

   eliminarUsuario= async (req: Request, res: Response)=> {
    try {
      const  idUsuario  = req.params.id;

      const usuario = await this.usuarioService.obtenerPorId(idUsuario);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (usuario.rol === 'doctor') {
        await this.doctorService.eliminarPorUsuarioId(idUsuario);
      } else if (usuario.rol === 'paciente') {
        await this.pacienteService.eliminarPorUsuarioId(idUsuario);
      }

      
      await this.usuarioService.eliminar(idUsuario); 
      res.json({ message: 'Usuario eliminado correctamente' })
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  login= async (req: Request, res: Response)=> {
    try {
      const { email, password } = req.body;
      const resultado = await this.usuarioService.login(email, password);
      res.json(resultado);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

 listarUsuarios= async (req: Request, res: Response)=> {
    try {
      
      const usuarios = await this.usuarioService.listarTodos();
      res.status(200).json(usuarios);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  obtenerPorId= async (req: Request, res: Response)=>{
    const { id } = req.params;
    try {
      const usuario = await this.usuarioService.obtenerPorId(id)
      res.status(200).json(usuario)
    } catch (error:any) {
      res.status(500).json({ message: error.message });

    }
  }

   actualizarUsuario= async (req: Request, res: Response)=>{
    const { id } = req.params;
    try {
      const usuario = await this.usuarioService.actualizar(id,req.body)
      res.status(200).json(usuario)
    } catch (error:any) {
      res.status(500).json({ message: error.message });

    }
  }
}