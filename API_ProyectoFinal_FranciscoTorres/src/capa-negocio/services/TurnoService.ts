import { TurnoRepository } from '../../capa-datos/repositories/TurnoRepository';

export class TurnoService {
  private repo = new TurnoRepository();
 
  constructor(){

    }
 public async crearTurno(datos: any, usuarioId: string) {
    const turnoData = {
      ...datos,
      paciente: usuarioId,
      estado: 'pendiente'
    };
    return this.repo.crear(turnoData);
  }

 public async obtenerTurnos() {
    return this.repo.obtenerTodos();
  }

 public async obtenerTurno(id: string) {
    return this.repo.obtenerPorId(id);
  }

 public async actualizarTurno(id: string, datos: any) {
    return this.repo.actualizar(id, datos);
  }

 public async eliminarTurno(id: string) {
    return this.repo.eliminar(id);
  }

 public async obtenerTurnosDoctor(doctorId: string) {
    return this.repo.obtenerPorDoctor(doctorId);
  }

 public async obtenerTurnosPaciente(pacienteId: string) {
    const turnos =await this.repo.obtenerPorPaciente(pacienteId)
    return turnos;
  }
}