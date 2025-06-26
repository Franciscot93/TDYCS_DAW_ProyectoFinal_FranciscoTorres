import express from 'express';
import { AuthService} from '../../../src/capa-negocio/services/AuthService'

const NewAuth:AuthService= new AuthService()
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log(req);
    const { email, password } = req.body;
    
    const { token, usuario } = await NewAuth.login(email, password);
    res.json({ token, usuario });
  } catch (error: any) {
    console.log('aqui');
    res.status(400).json({ error: error.message });
  }
});

export default router;