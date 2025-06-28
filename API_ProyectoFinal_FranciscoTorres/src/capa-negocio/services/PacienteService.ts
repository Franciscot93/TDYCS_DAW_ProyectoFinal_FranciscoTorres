import axios from 'axios';
import { config } from '../../config';

export class PacienteService {
  private baseUrl = `http://localhost:${config.ports.datos}/pacientes`;

  async crearPaciente(pacienteData: any) {
    try {
      const response = await axios.post(`${this.baseUrl}`, pacienteData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear paciente');
    }
  }

  async obtenerPorId(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Paciente no encontrado');
    }
  }

  async obtenerPorUsuarioId(usuarioId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/usuario/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Paciente no encontrado');
    }
  }

  async actualizar(id: string, datos: any) {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, datos);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar paciente');
    }
  }

  async eliminar(id: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar paciente');
    }
  }

  async listarTodos() {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al listar pacientes');
    }
  }

  async eliminarPorUsuarioId(usuarioId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/usuario/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar paciente');
    }
  }
}