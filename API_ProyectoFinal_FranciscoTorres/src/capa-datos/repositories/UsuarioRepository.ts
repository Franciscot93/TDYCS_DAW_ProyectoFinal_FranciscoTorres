import { Usuario as UsuarioModel } from '../models/Usuario';

export class UsuarioRepository {
  async crear(usuarioData: any) {
    return UsuarioModel.create(usuarioData);
  }

  async obtenerPorEmail(email: string) {
    return UsuarioModel.findOne({ email }).select('+password');
  }

  async obtenerPorId(id: string) {
    return UsuarioModel.findById(id).select('-password');
  }

  async actualizar(id: string, datos: any) {
    return UsuarioModel.findByIdAndUpdate(id, datos, { new: true }).select('-password');
  }

  async eliminar(id: string) {
    return UsuarioModel.findByIdAndDelete(id);
  }

  async listarTodos() {
    return UsuarioModel.find().select('-password');
  }
}