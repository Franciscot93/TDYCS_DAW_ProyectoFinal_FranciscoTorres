import { Request, Response } from 'express';
import { TurnoService } from '../../capa-negocio/services/TurnoService';


export class TurnoController {
  
  constructor(private readonly _servicio:TurnoService,){

  }
  crearTurno= async(req: Request, res: Response)=> {
    try {
      const turno = await  this._servicio.crearTurno(req.body, (req as any).user.id);
      res.status(201).json(turno);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear turno' });
    }
  }
obtenerTurnos= async(req: Request, res: Response)=>{
    try {
      const turnos = await  this._servicio.obtenerTurnos();
      res.json(turnos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener turnos' });
    }
  }

  obtenerTurnoPorId= async(req: Request, res: Response)=>{
      const idTurno = req.params.id;
    console.log(idTurno);
    
    try {
      const turnos = await this._servicio.obtenerTurno(idTurno);
      res.json(turnos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los datos del turno' });
    }
  }
   actualizarTurno= async(req: Request, res: Response)=>{
      const idTurno = req.params.id;
    console.log(idTurno);
     
    try {
      const turnos = await this._servicio.actualizarTurno(idTurno,req.body);
      res.json(turnos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar los datos del turno' });
    }
  }

  eliminarTurno= async(req: Request, res: Response)=>{
    const idTurno = req.params.id;
 
    
    try {
      const turnos = await this._servicio.eliminarTurno(idTurno);
      res.json(turnos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el turno' });
    }
  } 

   obtenerTurnosPorDoctor= async(req: Request, res: Response)=>{
      const idDoctor = req.params.id;
    console.log(idDoctor);
    
    try {
      const turnos = await this._servicio.obtenerTurnosDoctor(idDoctor);
      res.json(turnos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los datos del turno' });
    }
  }


obtenerTurnosPorPaciente = async (req: Request, res: Response) => {
    if ((req as any).user.rol === "paciente" &&
      req.params.pacienteId != (req as any).user.id
    ) {
      res.status(404).json({ error: "Paciente diferente al registrado" });
      return;
    }
    
    const pacienteId = req.params.pacienteId;
    console.log(pacienteId);
    
    try {
      const turnos = await this._servicio.obtenerTurnosPaciente(pacienteId);
      res.json(turnos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los turnos del paciente' });
    }
  }
  

}