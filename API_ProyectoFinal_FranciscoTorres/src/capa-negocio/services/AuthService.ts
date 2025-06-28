import axios from 'axios';
import { config } from '../../config';
import { JwtGenerator } from '../../jwt.adapter';
export class AuthService {
  private baseUrl=`http://localhost:${config.ports.datos}/auth`;
  public login =async(email: string, password: string)=> {
    
    console.log("servicio login");
    const usuario:any = await axios.post(`${this.baseUrl}/login`,{email:email,password:password});
     const oUser =usuario.data;
    if (!usuario ) {
      throw new Error('Credenciales inválidas');
    }

     const token = await JwtGenerator.generateToken({_id:oUser.id||oUser._id  ,rol:oUser.rol},config.jwt.expiresIn);
     const { password: _, ...usuarioSinPassword } = oUser;
     console.log({usuario:usuarioSinPassword, token:token });
     return {usuario:usuarioSinPassword, token:token };
  }

 

 
}