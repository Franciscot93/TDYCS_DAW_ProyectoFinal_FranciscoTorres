import { Schema, model } from 'mongoose';

export interface IUsuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  password: string;
  rol: 'paciente' | 'doctor' | 'admin';
  fechaCreacion: Date;
}

const usuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['paciente', 'doctor', 'admin'], required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);