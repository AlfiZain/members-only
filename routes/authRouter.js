import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.get('/signup', authController.showSignupForm);
authRouter.post('/signup', authController.signup);

authRouter.get('/login', authController.showLoginForm);
authRouter.post('/login', authController.login);

authRouter.get('/logout', authController.logout);

export default authRouter;
