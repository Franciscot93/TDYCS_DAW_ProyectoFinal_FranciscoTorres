import express from 'express';
import { config } from '../config';
import usuariosRouter from './routes/usuarios.routes';
import turnosRouter from './routes/turnos.routes';
import authRouter from './routes/auth.routes';
import { authMiddleware } from './middlewares/authMiddleware';

export async function startPresentationLayer() {
  const app = express();
  

app.use(express.json());
app.use('/api/', authRouter); 
app.use('/api/', usuariosRouter);
app.use('/api/', turnosRouter);
  
  return app.listen(config.ports.presentacion, () => {
    console.log(`🎨 Capa Presentación en http://localhost:${config.ports.presentacion}`);
  });
}