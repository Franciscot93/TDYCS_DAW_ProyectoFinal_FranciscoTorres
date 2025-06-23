import jwt from 'jsonwebtoken';
import { Usuario, IUsuario } from '../models/Usuario';
import dotenv from 'dotenv';
import { error } from 'console';
import { model } from 'mongoose';

dotenv.config();

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'DAW_FranciscoTorres_ProyectoFinal';
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

  public static async login(email: string, pass: string): Promise<{ usuario: any ,token: {};}> {
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario || !(await usuario.comparePassword(pass))) {
      throw new Error('Credenciales inválidas');
    }

    const oToken = await this.generateToken({ id: usuario._id, rol: usuario.rol },this.JWT_EXPIRES_IN)

    if (!oToken ) throw new Error(`Error en la autenticacion`);
    // const usuarioSinPassword = usuario.toObject();
    // delete usuarioSinPassword.password;
    const { password, ...restoDeDatosDelUsuario } =   usuario.toObject();
    return { usuario: {...restoDeDatosDelUsuario}, token:oToken  };
  }

  public static async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, this.JWT_SECRET);
  }

  static async generateToken(payload:any,duration:any='1h'){
        
        return new Promise((resolve)=>{

            jwt.sign(payload, this.JWT_SECRET,{expiresIn: duration},(err,token)=>{
                if (err) return resolve(null);

                return resolve(token)
            })

        })
        
       
    }
}