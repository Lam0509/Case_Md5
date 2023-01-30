import { Router } from 'express';
import AuthController from "../controllers/auth.controller";
const router = Router();
const authController = new AuthController

router.get('/login', authController.showFormLogin);
router.post('/login', authController.login);
router.get('/register', authController.showFormRegister);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

export default router;