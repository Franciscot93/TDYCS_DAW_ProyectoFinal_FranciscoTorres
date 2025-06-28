import jwt from 'jsonwebtoken'
import { config } from './config';


export class JwtGenerator{


    static async generateToken(payload:any,duration:any='1h'){
        
        return new Promise((resolve)=>{
            console.log(config.jwt.secret);
            jwt.sign(payload, config.jwt.secret,{expiresIn: duration},(err,token)=>{
                if (err) return resolve(null);
                return resolve(token)
            })

        })
        
       
    }

    static validateToken<T>(token:string):Promise<T|null>{
        return new Promise((resolve, reject) => {
            jwt.verify(token,config.jwt.secret,(err,decoded)=>{
                if(err)return resolve(null)
                resolve(decoded as T);
            })
        })
    }

    return : any;
}