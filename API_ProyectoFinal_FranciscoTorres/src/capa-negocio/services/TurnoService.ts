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
}