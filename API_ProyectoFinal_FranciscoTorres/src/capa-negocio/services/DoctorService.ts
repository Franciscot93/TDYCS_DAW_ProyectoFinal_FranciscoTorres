import { DoctorRepository } from '../../capa-datos/repositories/DoctorRepository';

export class DoctorService {
  private repo = new DoctorRepository();

  async crearDoctor(doctorData: any) {
    return this.repo.crear(doctorData);
  }

  async obtenerPorId(id: string) {
    return this.repo.obtenerPorId(id);
  }

  async obtenerPorUsuarioId(usuarioId: string) {
    return this.repo.obtenerPorUsuarioId(usuarioId);
  }

  async actualizar(id: string, datos: any) {
    return this.repo.actualizar(id, datos);
  }

  async eliminar(id: string) {
    return this.repo.eliminar(id);
  }

  async listarTodos() {
    return this.repo.listarTodos();
  }

  async eliminarPorUsuarioId(usuarioId:string){
    return this.repo.eliminarPorUsuarioId(usuarioId)
  }
  
}