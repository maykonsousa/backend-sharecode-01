import { Router } from 'express';
import { AuthenticateUserController } from 'modules/accounts/useCases/AuthenticateUser/AuthenticateUserController';
import { ForgotPasswordController } from 'modules/accounts/useCases/ForgotPassword/ForgotPasswordController';

export const authenticateRoutes = Router();
const auhenticateUserController = new AuthenticateUserController();
const forgotPasswordCOntroller = new ForgotPasswordController();

authenticateRoutes.post('/', auhenticateUserController.handle);
authenticateRoutes.post('/forgot', forgotPasswordCOntroller.handle);
