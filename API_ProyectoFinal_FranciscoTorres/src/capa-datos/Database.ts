import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private static instance: Database;
  private connection: mongoose.Connection;

  private constructor() {
    this.connection = mongoose.connection;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';
      const dbNAME= process.env.MONGO_DB_NAME
      const UriDB= dbUri + dbNAME
      await mongoose.connect(UriDB);
      console.log('Conexión a MongoDB establecida en capa de datos');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      process.exit(1);
    }
  }

  public getConnection(): mongoose.Connection {
    return this.connection;
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}