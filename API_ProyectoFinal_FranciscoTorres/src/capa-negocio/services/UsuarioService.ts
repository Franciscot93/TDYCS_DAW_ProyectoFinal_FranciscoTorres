import axios from "axios";
import { config } from "../../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DoctorService } from "./DoctorService";
import { PacienteService } from "./PacienteService";

export class UsuarioService {
  private baseUrl = `http://localhost:${config.ports.datos}/usuarios`;

  async registrarUsuario(usuarioData: any) {
    try {
      console.log(usuarioData);
      const response = await axios.post(`${this.baseUrl}`,  usuarioData);
       
      let perfil
      if (usuarioData.rol === "doctor") {
        const _servicio =new DoctorService()
        const { _id } = response.data;
         perfil = await _servicio.crearDoctor({
          usuario: _id,
          especialidad: usuarioData.especialidad,
          matricula: usuarioData.matricula,
        });
      } else if (usuarioData.rol === "paciente") {
        
        const _servicio =new PacienteService()
        const { _id} = response.data;

         perfil= await _servicio.crearPaciente({
          usuario: _id,
          obraSocial: usuarioData.obraSocial,
          numeroAfiliado: usuarioData.numeroAfiliado,
        });
      }
      const usuario:any=response.data
      const {password,...UsuarioNuevo}=usuario
      
      return {...UsuarioNuevo,perfil}
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/email/${email}`);
      const usuario: any = response.data;

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      const isValid = await bcrypt.compare(password, usuario.password);
      if (!isValid) {
        throw new Error("Credenciales inválidas");
      }

      // genero el JWT
      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        config.jwt.secret,
        { expiresIn: "1h" }
      );

      const { password: _, ...usuarioSinPassword } = usuario;
      return { usuario: usuarioSinPassword, token };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async obtenerPorId(id: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/usuarios/${id}`);
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Usuario no encontrado");
    }
  }

  async actualizar(id: string, datos: any) {
    try {
      console.log(id,datos);
      const response = await axios.put(`${this.baseUrl}/${id}`, datos);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al actualizar usuario"
      );
    }
  }

  async eliminar(id: string) {
    try {
      console.log("llego");
      const usuarioEliminar= (await axios.get(`${this.baseUrl}/usuarios/${id}`)).data;
      if (usuarioEliminar.rol==='doctor'){
        const _servicio =new DoctorService()
        await _servicio.eliminar(id)
      }
      if (usuarioEliminar.rol==='paciente'){
        const _servicio =new PacienteService()
        await _servicio.eliminar(id)
      } 

      const response = await axios.delete(`${this.baseUrl}/${id}`);
      return response.data;

    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al eliminar usuario"
      );
    }
  }

  async listarTodos() {
    try {
      console.log('usuario servicio');
      const response: any = await axios.get(`${this.baseUrl}`);
      
      return response.data.map((usuario: any) => {
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al listar usuarios"
      );
    }
  }

  async obtenerPorEmail(email: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/email/${email}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Usuario no encontrado");
    }
  }
}
