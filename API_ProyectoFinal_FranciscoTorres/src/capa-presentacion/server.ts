import express from 'express';
import { config } from '../config';
import usuariosRouter from './routes/usuarios.routes';
import turnosRouter from './routes/turnos.routes';
import authRouter from './routes/auth.routes';
import { authMiddleware } from './middlewares/authMiddleware';

export async function startPresentationLayer() {
  const app = express();
  

app.use(express.json());
app.use('/api/v1/', authRouter); 
app.use('/api/v1/', usuariosRouter);
app.use('/api/v1/', turnosRouter);
  
  return app.listen(config.ports.presentacion, () => {
    console.log(`🎨 Capa Presentación en http://localhost:${config.ports.presentacion}`);
  });
}