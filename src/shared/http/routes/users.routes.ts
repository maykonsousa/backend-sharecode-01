import { Router } from 'express';
import { CreateUserController } from 'modules/accounts/useCases/CreateUser/CreateUserController';
import { SetUserTypeController } from 'modules/accounts/useCases/SetUserType/SetUserTypeController';
import { EnsuresAdmin } from 'shared/middlewares/admin.middleware';
import { EnsureAuthenticated } from 'shared/middlewares/auth.middleware';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const setTypeUserController = new SetUserTypeController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.patch(
  '/admin/type',
  EnsureAuthenticated,
  EnsuresAdmin,
  setTypeUserController.handle
);
