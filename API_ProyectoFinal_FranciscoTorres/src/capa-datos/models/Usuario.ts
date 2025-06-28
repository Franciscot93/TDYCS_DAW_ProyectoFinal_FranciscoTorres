import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUsuario extends Document {
  email: string;
  password: string;
  rol: 'paciente' | 'doctor' | 'admin';
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  fechaCreacion: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  rol: { type: String, enum: ['paciente', 'doctor', 'admin'], required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  fechaCreacion: { type: Date, default: Date.now }
});

usuarioSchema.pre<IUsuario>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

usuarioSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};
usuarioSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret._id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.fechaCreacion
    delete ret.password;
    return ret;
  }
});

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);