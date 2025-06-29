import express from 'express';

import { AuthController } from '../controllers/AuthController';
const router = express.Router();
const _authController :AuthController= new AuthController()
router.post('/auth/login', async (req, res) => {
  try {
    
    const response= await _authController.login(req,res);
    

    res.json( response );
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;