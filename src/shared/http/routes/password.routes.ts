import { Router } from 'express';
import { ForgotPasswordController } from 'modules/accounts/useCases/ForgotPassword/ForgotPasswordController';
import { ResetPasswordController } from 'modules/accounts/useCases/ResetPassword/ResetPasswordController';

export const passwordRoutes = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post('/forgot', forgotPasswordController.handle);
passwordRoutes.post('/reset/:token', resetPasswordController.handle);
