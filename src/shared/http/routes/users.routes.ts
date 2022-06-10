import { Router } from 'express';
import { CreateUserController } from 'modules/accounts/useCases/CreateUser/CreateUserController';

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post('/', createUserController.handle);
