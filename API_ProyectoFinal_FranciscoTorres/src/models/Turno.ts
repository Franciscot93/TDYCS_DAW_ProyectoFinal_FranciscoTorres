import { Schema, model } from 'mongoose';

export interface ITurno {
  fecha: Date;
  paciente: Schema.Types.ObjectId;
  doctor: Schema.Types.ObjectId;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  motivo: string;
  notas?: string;
  fechaCreacion: Date;
}

const turnoSchema = new Schema<ITurno>({
  fecha: { type: Date, required: true },
  paciente: { type: Schema.Types.ObjectId, ref: 'Paciente', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'confirmado', 'cancelado', 'completado'], 
    default: 'pendiente' 
  },
  motivo: { type: String, required: true },
  notas: { type: String },
  fechaCreacion: { type: Date, default: Date.now }
});

export const Turno = model<ITurno>('Turno', turnoSchema);