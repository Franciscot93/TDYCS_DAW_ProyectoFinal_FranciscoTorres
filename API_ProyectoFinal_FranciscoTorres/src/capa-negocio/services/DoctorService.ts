import axios from 'axios';
import { config } from '../../config';

export class DoctorService {
  private baseUrl = `http://localhost:${config.ports.datos}/doctores`;

  async crearDoctor(doctorData: any) {
    try {
      console.log("doc service:",this.baseUrl)
      const response = await axios.post(`${this.baseUrl}`, doctorData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear doctor');
    }
  }

  async obtenerPorId(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Doctor no encontrado');
    }
  }

  async obtenerPorUsuarioId(usuarioId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/usuario/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Doctor no encontrado');
    }
  }

  async actualizar(id: string, datos: any) {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, datos);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar doctor');
    }
  }

  async eliminar(id: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar doctor');
    }
  }

  async listarTodos() {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al listar doctores');
    }
  }

  async eliminarPorUsuarioId(usuarioId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/usuario/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar doctor');
    }
  }
}