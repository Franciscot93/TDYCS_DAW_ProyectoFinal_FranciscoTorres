import { Schema, model } from 'mongoose';
import { IUsuario } from './Usuario';

export interface IDoctor extends IUsuario {
  especialidad: string;
  matricula: string;
  horarioAtencion: {
    dias: string[];
    horarioInicio: string;
    horarioFin: string;
  };
}

const doctorSchema = new Schema<IDoctor>({
  especialidad: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  horarioAtencion: {
    dias: [{ type: String }],
    horarioInicio: { type: String },
    horarioFin: { type: String }
  }
});

export const Doctor = model<IDoctor>('Doctor', doctorSchema);