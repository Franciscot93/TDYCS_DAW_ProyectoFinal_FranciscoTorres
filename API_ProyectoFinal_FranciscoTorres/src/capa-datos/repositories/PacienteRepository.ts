import { Paciente as PacienteModel } from '../models/Paciente';

export class PacienteRepository {
  async crear(pacienteData: any) {
    return PacienteModel.create(pacienteData);
  }

  async obtenerPorId(id: string) {
    return PacienteModel.findById(id).populate('usuario');
  }

  async obtenerPorUsuarioId(usuarioId: string) {
    return PacienteModel.findOne({ usuario: usuarioId }).populate('usuario');
  }

  async actualizar(id: string, datos: any) {
    return PacienteModel.findByIdAndUpdate(id, datos, { new: true }).populate('usuario');
  }

  async eliminar(id: string) {
    return PacienteModel.findByIdAndDelete(id);
  }

  async listarTodos() {
    return PacienteModel.find().populate('usuario');
  }

  async eliminarPorUsuarioId(usuarioId: string) {
  return PacienteModel.findOneAndDelete({ usuario: usuarioId });
}
}