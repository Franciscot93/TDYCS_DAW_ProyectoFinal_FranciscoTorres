import express from 'express';
import { config } from '../config';
import turnoRoutes from '../capa-presentacion/routes/turnos.routes';
import usuarioRoutes from '../capa-presentacion/routes/usuarios.routes';

export async function startBusinessLayer() {
  const app = express();
  
  app.use(express.json());
  
  app.use('/turnos', turnoRoutes);
  app.use('/usuarios', usuarioRoutes);
  
  return app.listen(config.ports.negocio, () => {
    console.log(`🧠 Capa Negocio en http://localhost:${config.ports.negocio}`);
  });
}