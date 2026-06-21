import { Router } from 'express';
import * as messagesController from '../controllers/messagesController.js';
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.js';

const messagesRouter = Router();

messagesRouter.get('/create', ensureAuthenticated, messagesController.create);
messagesRouter.post('/', ensureAuthenticated, messagesController.store);

messagesRouter.post('/:id/delete', ensureAdmin, messagesController.destroy);

export default messagesRouter;
