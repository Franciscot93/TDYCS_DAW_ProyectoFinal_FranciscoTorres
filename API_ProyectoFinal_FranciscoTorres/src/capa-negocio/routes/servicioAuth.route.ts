import express from 'express';
import { AuthService} from '../services/AuthService'

const NewAuth:AuthService= new AuthService()
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, usuario } = await NewAuth.login(email, password);
    res.json({ token, usuario });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;