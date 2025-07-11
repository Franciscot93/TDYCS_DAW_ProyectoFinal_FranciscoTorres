import express from 'express';
import { config } from '../config';
import turnoRoutes from './routes/servicioTurnos.routes'
import usuarioRoutes from './routes/servicioUsuarios.routes'
import authRouter from './routes/servicioAuth.route'

export async function startBusinessLayer() {
  const app = express();

  app.use(express.json());
  
  app.use('/auth',authRouter)
  app.use('/turnos', turnoRoutes);
  app.use("/usuarios", usuarioRoutes);
  
  return app.listen(config.ports.negocio, () => {
    console.log(`🧠 Capa Negocio en http://localhost:${config.ports.negocio}`);
  });
}
