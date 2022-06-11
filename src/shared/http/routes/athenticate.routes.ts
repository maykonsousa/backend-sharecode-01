import { Router } from 'express';
import { AuthenticateUserController } from 'modules/accounts/useCases/AuthenticateUser/AuthenticateUserController';

export const authenticateRoutes = Router();
const auhenticateUserController = new AuthenticateUserController();

authenticateRoutes.post('/', auhenticateUserController.handle);
