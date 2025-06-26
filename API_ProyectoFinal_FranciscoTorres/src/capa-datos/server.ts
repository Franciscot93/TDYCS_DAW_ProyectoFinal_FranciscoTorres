import express from 'express';
import mongoose from 'mongoose';
import { config } from '../config';
import turnoRoutes from '../capa-presentacion/routes/turnos.routes';
import usuarioRoutes from '../capa-presentacion/routes/usuarios.routes';
import authRouter from '../capa-presentacion/routes/auth.routes'
export async function startDataLayer() {
  const app = express();
  
  // Conexión a MongoDB
  await mongoose.connect(config.mongo.uri.toString(),{dbName:config.mongo.dbName.toString()});
  
  // Middlewares
  app.use(express.json());
  
  // Rutas
   app.use('/auth',authRouter);
  app.use('/turnos', turnoRoutes);
  app.use('/usuarios', usuarioRoutes);
  
  // Iniciar servidor
  return app.listen(config.ports.datos, () => {
    console.log(`🛢️  Capa Datos en http://localhost:${config.ports.datos}`);
  });
}