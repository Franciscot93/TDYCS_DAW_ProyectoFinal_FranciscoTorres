import 'dotenv/config';
import { get } from 'env-var';

export const config = {
  mongo: {
    uri: get('MONGODB_URI').required().asString(),
    dbName: get('MONGO_DB_NAME').required().asString()
  },
  jwt: {
    secret: get('JWT_SECRET').required().asString(),
    expiresIn: get('JWT_EXPIRES_IN').default('1h').asString()
  },
  ports: {
    datos: get('DATOS_PORT').default(3001).asPortNumber(),
    negocio:get('NEGOCIO_PORT').default(3002).asPortNumber(),
    presentacion:get('PRESENTACION_PORT').default(3000).asPortNumber()
  }
};