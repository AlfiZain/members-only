import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { ensureAuthenticated, ensureGuest } from '../middlewares/auth.js';

const authRouter = Router();

authRouter.get('/signup', ensureGuest, authController.showSignupForm);
authRouter.post('/signup', ensureGuest, authController.signup);

authRouter.get('/login', ensureGuest, authController.showLoginForm);
authRouter.post('/login', ensureGuest, authController.login);

authRouter.get('/logout', ensureAuthenticated, authController.logout);

export default authRouter;
