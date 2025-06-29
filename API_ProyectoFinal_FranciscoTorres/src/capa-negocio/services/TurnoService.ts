import axios from 'axios';
import { config } from '../../config';

export class TurnoService {
  private baseUrl = `http://localhost:${config.ports.datos}/turnos`;

  async crearTurno(datos: any, usuarioId: string) {
      datos.paciente= usuarioId
      datos.estado= 'pendiente'
    
    const response = await axios.post(`${this.baseUrl}`, datos);
    return response.data;
  }

  async obtenerTurnos() {
    console.log("servicio");
    const response = await axios.get(`${this.baseUrl}`)
    return response.data;
  }

  async obtenerTurno(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public async actualizarTurno(id: string, datos: any) {
    const response = await axios.put(`${this.baseUrl}/${id}`,datos)
    return response.data
  }

 public async eliminarTurno(id: string) {
    const response = await axios.delete(`${this.baseUrl}/${id}`)
    return response.data
  }

 public async obtenerTurnosDoctor(doctorId: string) {
  console.log("llego a servicio");
    const response = await axios.get(`${this.baseUrl}/doctor/${doctorId}`)
    return response.data
  }

 public async obtenerTurnosPaciente(pacienteId: string) 
 { 
   const response = await axios.get(`${this.baseUrl}/pacientes/${pacienteId}`)
    return response.data
  }


async actualizarParcialTurno(id: string, datosActualizacion: any) {
  //try {
  //   // Validar que exista el turno
  //   //const turnoExistente = await s(id);
  //   if (!turnoExistente) {
  //     throw new Error('Turno no encontrado');
  //   }

  //   // Actualizar solo los campos proporcionados
  //   const datosActualizados = {
  //     ...turnoExistente,
  //     ...datosActualizacion,
  //     ultimaActualizacion: new Date() // Campo de auditoría
  //   };

  //   // Enviar la actualización a la capa de datos
  //   const response = await axios.patch(`${this.baseUrl}/turnos/${id}`, datosActualizados);
    
  //   return response.data;
  // } catch (error: any) {
  //   console.error('Error en actualizarParcialTurno:', error);
  //   throw new Error(error.response?.data?.message || 'Error al actualizar turno');
  
   //}
}
}