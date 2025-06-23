import { Request, Response } from "express";
import { Turno } from "../models/Turno";
import { Usuario } from "../models/Usuario";

export class TurnoController {
  public async crearTurno(req: Request, res: Response): Promise<void> {
    try {
      console.log(req);
      const { fecha, doctor, motivo, notas } = req.body;
      const nuevoTurno = new Turno({
        fecha,
        doctor,
        motivo,
        notas: notas || "",
        paciente: (req as any).user.id,
        estado: "pendiente",
      });
      await nuevoTurno.save();
      res.status(201).json(nuevoTurno);
    } catch (error) {
      res.status(500).json({ error: "Error al crear turno" });
    }
  }

  public async obtenerTurnos(req: Request, res: Response): Promise<void> {
    try {
      const turnos = await Turno.find().populate("paciente").populate("doctor");
      res.json(turnos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener turnos" });
    }
  }

  public async obtenerTurnoPorId(req: Request, res: Response): Promise<void> {
    try {
      const turno = await Turno.findById(req.params.id)
        .populate({
          path: "paciente",
          model: "Paciente", // Nombre exacto del modelo
          select: "nombre apellido email", // Campos específicos que quieres
        })
        .populate({
          path: "doctor",
          model: "Doctor", // Nombre exacto del modelo
          select: "nombre apellido especialidad",
        });

      if (!turno) {
        res.status(404).json({ error: "Turno no encontrado" });
        return;
      }
      res.json(turno);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener turno" });
    }
  }

  public async actualizarTurno(req: Request, res: Response): Promise<void> {
    try {
      const turno = await Turno.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .populate("paciente")
        .populate("doctor");

      if (!turno) {
        res.status(404).json({ error: "Turno no encontrado" });
        return;
      }
      res.json(turno);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar turno" });
    }
  }

  public async eliminarTurno(req: Request, res: Response): Promise<void> {
    try {
      const turno = await Turno.findByIdAndDelete(req.params.id);
      if (!turno) {
        res.status(404).json({ error: "Turno no encontrado" });
        return;
      }
      res.json({ message: "Turno eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar turno" });
    }
  }

  public async obtenerTurnosPorDoctor(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const turnos = await Turno.find({ doctor: req.params.doctorId })
        .populate("paciente")
        .populate("doctor");
      res.json(turnos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener turnos del doctor" });
    }
  }

  public async obtenerTurnosPorPaciente(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (
        (req as any).user.rol === "paciente" &&
        req.params.pacienteId != (req as any).user.id
      ) {
        res.status(404).json({ error: "Paciente diferente al registrado" });
        return;
      }
      const turnos = await Turno.find({ paciente: req.params.pacienteId })
        .populate({
          path: "paciente",
          model: "Usuario" // Nombre exacto del modelo
          
        })
        .populate({
          path: "doctor",
          model: "Usuario"
        });
      res.json(turnos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener turnos del paciente" });
    }
  }
}
