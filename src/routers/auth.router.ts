import { Router } from 'express';
import AuthController from "../controllers/auth.controller";
const authRouter = Router();
const authController = new AuthController

authRouter.get('/login', authController.showFormLogin);
authRouter.post('/login', authController.login);
authRouter.get('/register', authController.showFormRegister);
authRouter.post('/register', authController.register);
authRouter.post('/logout', authController.logout);

export default authRouter;