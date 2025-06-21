import { Schema, model } from 'mongoose';
import { IUsuario } from './Usuario';

export interface IPaciente extends IUsuario {
  obraSocial?: string;
  numeroAfiliado?: string;
  historialMedico?: string[];
}

const pacienteSchema = new Schema<IPaciente>({
  obraSocial: { type: String },
  numeroAfiliado: { type: String },
  historialMedico: [{ type: String }]
});

export const Paciente = model<IPaciente>('Paciente', pacienteSchema);