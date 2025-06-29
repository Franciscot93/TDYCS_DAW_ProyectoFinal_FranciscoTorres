import express from 'express';
import { config } from '../config';
import usuariosRouter from './routes/usuarios.routes';
import turnosRouter from './routes/turnos.routes';
import authRouter from './routes/auth.routes';
import { CustomError } from '../errors/custom.error';

export async function startPresentationLayer() {


  const app = express();
  

app.use(express.json());
app.use('/api/v1/', authRouter); 
app.use('/api/v1/', usuariosRouter);
app.use('/api/v1/', turnosRouter);
  
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
if(err instanceof CustomError){
            return res.status(err.statusCode).json({error:err.message});
        }
        console.log(`${err}`)
        return res.status(500).json({error: 'Internal server Error'})
})
  return app.listen(config.ports.presentacion, () => {
    console.log(`🎨 Capa Presentación en http://localhost:${config.ports.presentacion}`);
  });

}