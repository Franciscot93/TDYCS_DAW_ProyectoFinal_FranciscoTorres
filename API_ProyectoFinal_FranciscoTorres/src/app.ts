import express from 'express';
import bodyParser from 'body-parser';
import { Database } from './services/Database';
import usuariosRouter from './routes/usuarios.routes';
import turnosRouter from './routes/turnos.routes';

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());


app.use('/api', usuariosRouter);
app.use('/api', turnosRouter);


const db = Database.getInstance();
db.connect().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});


export default app;