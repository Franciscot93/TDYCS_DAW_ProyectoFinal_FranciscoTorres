import { PacienteRepository } from '../../capa-datos/repositories/PacienteRepository';

export class PacienteService {
  private repo = new PacienteRepository();

  async crearPaciente(pacienteData: any) {
    return this.repo.crear(pacienteData);
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
 
   async eliminarPorUsuarioId(usuarioId: string) {
    return this.repo.eliminarPorUsuarioId(usuarioId);
  }
}