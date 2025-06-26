import { Doctor as DoctorModel } from '../models/Doctor';

export class DoctorRepository {
  async crear(doctorData: any) {
    return DoctorModel.create(doctorData);
  }

  async obtenerPorId(id: string) {
    return DoctorModel.findById(id).populate('usuario');
  }

  async obtenerPorUsuarioId(usuarioId: string) {
    return DoctorModel.findOne({ usuario: usuarioId }).populate('usuario');
  }

  async actualizar(id: string, datos: any) {
    return DoctorModel.findByIdAndUpdate(id, datos, { new: true }).populate('usuario');
  }

  async eliminar(id: string) {
    return DoctorModel.findByIdAndDelete(id);
  }

  async listarTodos() {
    return DoctorModel.find().populate('usuario');
  }

  async eliminarPorUsuarioId(usuarioId: string) {
  return DoctorModel.findOneAndDelete({ usuario: usuarioId });
}
}