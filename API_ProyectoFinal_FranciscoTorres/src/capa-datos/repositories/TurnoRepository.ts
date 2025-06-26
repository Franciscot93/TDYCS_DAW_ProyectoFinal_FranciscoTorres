import { Turno as TurnoModel } from '../models/Turno';

export class TurnoRepository {
  async crear(turnoData: any) {
    return TurnoModel.create(turnoData);
  }

  async obtenerTodos() {
    return TurnoModel.find()
       .populate({
          path: "paciente",
          model: "Usuario" 
          
        })
        .populate({
          path: "doctor",
          model: "Usuario"
        });
  }

  async obtenerPorId(id: string) {
    return TurnoModel.findById(id)
      .populate({
          path: "paciente",
          model: "Usuario" 
          
        })
        .populate({
          path: "doctor",
          model: "Usuario"
        });
  }

  async actualizar(id: string, datos: any) {
    return TurnoModel.findByIdAndUpdate(id, datos, { new: true })
      .populate({
          path: "paciente",
          model: "Usuario" 
          
        })
        .populate({
          path: "doctor",
          model: "Usuario"
        });
  }

  async eliminar(id: string) {
    return TurnoModel.findByIdAndDelete(id);
  }

  async obtenerPorDoctor(doctorId: string) {
    return TurnoModel.find({ doctor: doctorId })
      .populate({
          path: "paciente",
          model: "Usuario" 
          
        })
        .populate({
          path: "doctor",
          model: "Usuario"
        });;
  }

  async obtenerPorPaciente(pacienteId: string) {
    console.log("repo");
    return TurnoModel.find({ paciente: pacienteId })
      .populate({
          path: "paciente",
          model: "Usuario" 
          
        })
        .populate({
          path: "doctor",
          model: "Usuario"
        });
  }
}