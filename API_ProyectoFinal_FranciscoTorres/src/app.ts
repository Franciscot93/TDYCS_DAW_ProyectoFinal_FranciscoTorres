import { config } from './config';
import { startDataLayer } from './capa-datos/server';
import { startBusinessLayer } from './capa-negocio/server'
import { startPresentationLayer } from './capa-presentacion/server';

async function main() {
  try {
    
    await startDataLayer();
    await startBusinessLayer();
    await startPresentationLayer();
    
    console.log(`✅ Todos los servicios están corriendo:
  - Datos: http://localhost:${config.ports.datos}
  - Negocio: http://localhost:${config.ports.negocio}
  - Presentación: http://localhost:${config.ports.presentacion}`);
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

main();