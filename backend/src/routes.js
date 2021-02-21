import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import LoginController from './app/controllers/LoginController';
import authMiddleware from './app/middlewares/auth';
import HelpController from './app/controllers/HelpController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', upload.single('file'), UserController.store);
routes.post('/sessions', LoginController.store);

routes.use(authMiddleware)

routes.put('/users', upload.single('file'), UserController.update);

routes.post('/helps', upload.array('file'), HelpController.store);
routes.get('/helps' , HelpController.index);
routes.put('/helps/:id', upload.array('file'), HelpController.update);
routes.delete('/helps/:id', HelpController.delete);

export default routes;