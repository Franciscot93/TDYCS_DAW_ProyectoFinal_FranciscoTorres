import { Schema, model } from 'mongoose';
import { Usuario } from './Usuario';

export interface IDoctor {
  usuario: Schema.Types.ObjectId;
  especialidad: string;
  matricula: string;
  horarioAtencion?: {
    dias: string[];
    horarioInicio: string;
    horarioFin: string;
  };
}

const doctorSchema = new Schema<IDoctor>({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  especialidad: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  horarioAtencion: {
    dias: [{ type: String }],
    horarioInicio: { type: String },
    horarioFin: { type: String }
  }
});

export const Doctor = model<IDoctor>('Doctor', doctorSchema);