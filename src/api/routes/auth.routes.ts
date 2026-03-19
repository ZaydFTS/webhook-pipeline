import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';


const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);   // ← new
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authController.me);


export default authRouter;
