import { Schema, model } from 'mongoose';
import { Usuario } from './Usuario';

export interface IPaciente {
  usuario: Schema.Types.ObjectId;
  obraSocial?: string;
  numeroAfiliado?: string;
  historialMedico?: string[];
}

const pacienteSchema = new Schema<IPaciente>({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  obraSocial: { type: String },
  numeroAfiliado: { type: String },
  historialMedico: [{ type: String }]
});

export const Paciente = model<IPaciente>('Paciente', pacienteSchema);