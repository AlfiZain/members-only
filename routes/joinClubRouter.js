import { Router } from 'express';
import * as joinClubController from '../controllers/joinClubController.js';
import { ensureAuthenticated } from '../middlewares/auth.js';

const joinClubRouter = Router();

joinClubRouter.use(ensureAuthenticated);

joinClubRouter.get('/', joinClubController.index);
joinClubRouter.post('/', joinClubController.verifyCode);

export default joinClubRouter;
