import { Router } from 'express';
import * as homeController from '../controllers/homeController.js';

const homeRouter = Router();

homeRouter.get('/', homeController.index);

export default homeRouter;
