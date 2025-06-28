import bcrypt from 'bcryptjs';
import { Doctor } from '../models/Doctor';
import { Paciente } from '../models/Paciente';
import { Usuario as UsuarioModel } from '../models/Usuario';


export class UsuarioRepository {
  async crear(usuarioData: any) {
    const existeUsuario= await UsuarioModel.findOne({email: usuarioData.email} )
    if (existeUsuario) throw new Error('El email no es correcto')
      const existeUsuarioDni= await UsuarioModel.findOne({dni: usuarioData.dni} )
    if (existeUsuarioDni) throw new Error('DNI en uso')
      
      const NuevoUsuario= await UsuarioModel.create(usuarioData)
      return NuevoUsuario.toObject();
      
   
  }

  obtenerPorEmail= async (email: string) => {
    const usuario = await UsuarioModel.findOne({email: email })
    .select('+password')
    

  return usuario;;
  }

  validaLogin=async(email:string,password:string)=>{
    const usuario:any = await UsuarioModel.findOne({email: email })
    .select('+password')
    .exec()
   
    const isMatch = await bcrypt.compare(password, usuario.password);
    console.log(isMatch);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }
    
  
  return usuario?.toJSON(); 

  }

  async obtenerPorId(id: string) {
  const usuario = await UsuarioModel.findById(id)
    .select('-password')    
    .exec()

  if (!usuario) {
    return null; 
  }

 
  return  usuario?.toJSON();
}  

  async actualizar(id: string, datos: any) {
   const usuario = await UsuarioModel.findByIdAndUpdate(id, datos, { 
    new: true 
  })
  .select('-password')
  .lean();

  if (!usuario) return null;

  if (usuario.rol === 'doctor') {
    const doctor = await Doctor.findOne({ usuario: usuario._id }).lean();
    return { ...usuario, detalle: doctor };
  } else if (usuario.rol === 'paciente') {
    const paciente = await Paciente.findOne({ usuario: usuario._id }).lean();
    return { ...usuario, detalle: paciente };
  }

  return usuario;
  }

  async eliminar(id: string) {
    const usuario = await UsuarioModel.findByIdAndDelete(id).lean();

  if (!usuario) return null;

  if (usuario.rol === 'doctor') {
    await Doctor.findOneAndDelete({ usuario: usuario._id });
  } else if (usuario.rol === 'paciente') {
    await Paciente.findOneAndDelete({ usuario: usuario._id });
  }

  return usuario;
  }

  async listarTodos() {
 
   
  const usuarios = await UsuarioModel.find()
    .select(['-password','-__v'])
    .lean(); 

  const usuariosConDetalles = await Promise.all(
    usuarios.map(async (usuario) => {
      if (usuario.rol === 'doctor') {
        const doctor = await Doctor.findOne({ usuario: usuario._id }).select(['-_id','-usuario','-__v']).lean();
        return { ...usuario, perfil: doctor };
      } else if (usuario.rol === 'paciente') {
        const paciente = await Paciente.findOne({ usuario: usuario._id }).select(['-_id','-usuario','-__v']).lean();
        return { ...usuario, perfil: paciente };
      }
      return usuario;
    })
  );
  console.log(usuariosConDetalles);
  return usuariosConDetalles;
  }
}