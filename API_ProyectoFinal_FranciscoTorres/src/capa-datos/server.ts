import express from 'express';
import mongoose from 'mongoose';
import { config } from '../config';
import turnoRoutes from './routes/datosTurnos.Routes';
import usuarioRoutes from './routes/datosUsuario.routes'
import pacienteRoutes from'./routes/datosPaciente.routes'
import doctorRoutes from './routes/datosDoctor.routes'
import authRouter from './routes/datosAuth.routes'
export async function startDataLayer() {
  const app = express();
  
  await mongoose.connect(config.mongo.uri.toString(),{dbName:config.mongo.dbName.toString()});
  
  app.use(express.json());
  
  app.use('/auth',authRouter);
  app.use('/turnos', turnoRoutes);
  app.use('/usuarios', usuarioRoutes);
  app.use('/pacientes',pacienteRoutes)
  
  return app.listen(config.ports.datos, () => {
    console.log(`🛢️  Capa Datos en http://localhost:${config.ports.datos}`);
  });
}