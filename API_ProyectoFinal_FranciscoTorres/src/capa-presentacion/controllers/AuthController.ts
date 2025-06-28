import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config';

export class AuthController {
  private baseUrl = `http://localhost:${config.ports.negocio}/auth`;

  
  async login(req: Request, res: Response) {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, req.body);
      res.json(response.data);
    } catch (error: any) {
      res.status(401).json({ 
        message: error.response?.data?.message || error.message 
      });
    }
  }

  
}