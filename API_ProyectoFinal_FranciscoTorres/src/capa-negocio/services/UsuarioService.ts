import { UsuarioRepository } from '../../capa-datos/repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AuthService } from './AuthService';

export class UsuarioService {
  private repo = new UsuarioRepository();
    private NewAuth:AuthService= new AuthService()    
  async registrarUsuario(usuarioData: any) {
    const hashedPassword = await bcrypt.hash(usuarioData.password, 10);
    return this.repo.crear({
      ...usuarioData,
      password: hashedPassword
    });
  }

  async login(email: string, password: string) {
    const usuario = await this.repo.obtenerPorEmail(email);
    if (!usuario) throw new Error('Usuario no encontrado');
    
    const isValid = await bcrypt.compare(password, usuario.password);
    if (!isValid) throw new Error('Credenciales inválidas');
    
    const token = this.NewAuth.generarToken( usuario.id, usuario.rol );
    
    const { password: _, ...usuarioSinPassword } = usuario.toObject();
    return { usuario: usuarioSinPassword, token };
  }

    async obtenerPorId(id: string) {
      return this.repo.obtenerPorId(id);
    }
  
    async actualizar(id: string, datos: any) {
      return this.repo.actualizar(id, datos);
    }
  
    async eliminar(id: string) {
      return this.repo.eliminar(id);
    }
  
    async listarTodos() {
      return this.repo.listarTodos()
    }
}

